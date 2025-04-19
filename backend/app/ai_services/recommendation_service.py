import logging
import numpy as np
from bson import ObjectId
from collections import defaultdict
from motor.motor_asyncio import AsyncIOMotorDatabase
from sklearn.cluster import DBSCAN, KMeans
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.log_views_collection = database.log_views
        self.applier_collection = database.appliers
    
    async def cluster_users_DBSCAN(self, eps=0.5, min_samples=5):
        try:
            all_users = set()
            all_jobs = set()
            user_job_view_counts = defaultdict(lambda: defaultdict(int))
            
            logs = await self.log_views_collection.find().to_list(length=100000)
            
            for log in logs:
                user_id = str(log["applier_id"])
                job_id = str(log["job_id"])
                all_users.add(user_id)
                all_jobs.add(job_id)
                user_job_view_counts[user_id][job_id] += 1
            
            job_index = {j: i for i, j in enumerate(sorted(all_jobs))}
            user_vectors = []
            user_ids = []
            
            max_views = 0
            for user_id, job_counts in user_job_view_counts.items():
                for job_id, count in job_counts.items():
                    max_views = max(max_views, count)
            
            logger.info(f"Maximum view count: {max_views}")
            
            for user_id, job_counts in user_job_view_counts.items():
                vector = np.zeros(len(all_jobs))
                for job_id, count in job_counts.items():
                    # Option 1: Raw count
                    # vector[job_index[job_id]] = count
                    
                    # Option 2: Normalized count (0-1 range)
                    vector[job_index[job_id]] = count / max_views
                    
                    # Option 3: Log transformation to reduce impact of outliers
                    # vector[job_index[job_id]] = np.log1p(count)
                
                user_vectors.append(vector)
                user_ids.append(user_id)
            
            if not user_vectors:
                logger.warning("No user vectors generated. Check if there's enough view data.")
                return False
            
            user_matrix = np.vstack(user_vectors)
            
            similarity_matrix = cosine_similarity(user_matrix)
            distance_matrix = 1 - similarity_matrix
            
            clustering = DBSCAN(eps=eps, min_samples=min_samples, metric='precomputed')
            clusters = clustering.fit_predict(distance_matrix)
            
            for i, user_id in enumerate(user_ids):
                cluster_id = int(clusters[i]) if clusters[i] >= 0 else None
                await self.applier_collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {
                        "cluster_id": cluster_id
                    }}
                )
            
            return True
        
        except Exception as e:
            logger.error(f"Error in clustering users: {e}")
            return False
    
    async def cluster_users_KMeans(self, n_clusters=5):
        try:
            all_users = set()
            all_jobs = set()
            user_job_view_counts = defaultdict(lambda: defaultdict(int))
            
            logs = await self.log_views_collection.find().to_list(length=100000)
            
            for log in logs:
                user_id = str(log["applier_id"])
                job_id = str(log["job_id"])
                all_users.add(user_id)
                all_jobs.add(job_id)
                user_job_view_counts[user_id][job_id] += 1
            
            job_index = {j: i for i, j in enumerate(sorted(all_jobs))}
            user_vectors = []
            user_ids = []
            
            max_views = 0
            for user_id, job_counts in user_job_view_counts.items():
                for job_id, count in job_counts.items():
                    max_views = max(max_views, count)
            
            
            for user_id, job_counts in user_job_view_counts.items():
                vector = np.zeros(len(all_jobs))
                for job_id, count in job_counts.items():
                    # Option 2: Normalized count (0-1 range)
                    vector[job_index[job_id]] = count / max_views
                
                user_vectors.append(vector)
                user_ids.append(user_id)
            
            if not user_vectors:
                logger.warning("No user vectors generated. Check if there's enough view data.")
                return False
            
            user_matrix = np.vstack(user_vectors)
            
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            clusters = kmeans.fit_predict(user_matrix)
            
            for i, user_id in enumerate(user_ids):
                cluster_id = int(clusters[i])
                await self.applier_collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {
                        "cluster_id": cluster_id
                    }}
                )
            
            return True
        
        except Exception as e:
            logger.error(f"Error in clustering users: {e}")
            return False