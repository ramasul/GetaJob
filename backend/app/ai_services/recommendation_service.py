import logging
import numpy as np
from bson import ObjectId
from collections import defaultdict, Counter
from motor.motor_asyncio import AsyncIOMotorDatabase
from sklearn.cluster import DBSCAN, KMeans
# from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.constants import POPULAR_VIEWS_THRESHOLD

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.log_views_collection = database.log_views
        self.applier_collection = database.appliers
        self.job_collection = database.jobs
        self.threshold_view_count = POPULAR_VIEWS_THRESHOLD
    
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
            # n_components = min(10, user_matrix.shape[1]) # Untuk implementasi PCA (Jika data banyak)
            # pca = PCA(n_components=n_components)
            # reduced_matrix = pca.fit_transform(user_matrix)
            # logger.info(f"Reduced matrix: {reduced_matrix}")

            # similarity_matrix = cosine_similarity(reduced_matrix)
            similarity_matrix = cosine_similarity(user_matrix)
            # logger.info(f"Similarity matrix: {similarity_matrix}")
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
            # logger.info(f"User matrix: {user_matrix}")
            # n_components = min(10, user_matrix.shape[1])
            # pca = PCA(n_components=n_components)
            # reduced_matrix = pca.fit_transform(user_matrix)
            # logger.info(f"Reduced matrix: {reduced_matrix}")
            
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            # clusters = kmeans.fit_predict(reduced_matrix)
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
        
    async def get_recommendations_for_user(self, user_id, limit=10, view_weight_factor=0.5): # 0.3 ~ 1.0
        """
        Mendapatkan rekomendasi pekerjaan untuk pengguna (Applier) berdasarkan clusternya
        
        Args:
            user_id (str): Applier ID
            limit (int): Jumlah maksimal rekomendasi pekerjaan
            view_weight_factor (float): Faktor decay (> 0.0, sebaiknya di antara 0.0 ~ 1.0), semakin tinggi semakin tajam decay-nya
            
        Returns:
            list: List dari Job ID
        """
        try:
            user = await self.applier_collection.find_one({"_id": ObjectId(user_id)})            
            if not user or "cluster_id" not in user:
                return await self._get_fallback_recommendations(user_id, limit, view_weight_factor)
            
            cluster_id = user["cluster_id"]
            cluster_users = await self.applier_collection.find(
                {"cluster_id": cluster_id, "_id": {"$ne": ObjectId(user_id)}}
            ).to_list(length=100)
            
            if not cluster_users:
                return await self._get_fallback_recommendations(user_id, limit, view_weight_factor)           
            cluster_user_ids = [str(user["_id"]) for user in cluster_users]
            
            pipeline = [
                {"$match": {"applier_id": {"$in": [ObjectId(uid) for uid in cluster_user_ids]}}},
                {"$group": {"_id": "$job_id", "view_count": {"$sum": 1}}},
                {"$match": {"view_count": {"$gte": self.threshold_view_count}}},
                {"$sort": {"view_count": -1}},
                {"$limit": limit * 3}
            ]
            
            popular_jobs = await self.log_views_collection.aggregate(pipeline).to_list(length=None)
            user_viewed_jobs = await self.log_views_collection.find(
                {"applier_id": ObjectId(user_id)}
            ).to_list(length=None)
            
            user_view_counts = defaultdict(int)
            for log in user_viewed_jobs:
                job_id = str(log["job_id"])
                user_view_counts[job_id] += 1
            
            # Skoring
            job_scores = []
            for job in popular_jobs:
                job_id = str(job["_id"])
                cluster_score = job["view_count"]
                
                # Weight Reduction
                if job_id in user_view_counts:
                    # Makin banyak diliat user -> Makin kecil bobotnya
                    view_count = user_view_counts[job_id]
                    weight_reduction = 1/ (1 + view_count ** view_weight_factor)  # Smoothed Decay 
                    final_score = cluster_score * weight_reduction
                else:
                    final_score = cluster_score
                
                job_scores.append((job_id, final_score))
            
            job_scores.sort(key=lambda x: x[1], reverse=True)
            top_job_ids = [job_id for job_id, _ in job_scores[:limit]]
            
            # Apabila kurang dari limit, ambil rekomendasi fallback
            if len(top_job_ids) < limit:
                fallback_recommendations = await self._get_fallback_recommendations(
                    user_id, 
                    limit - len(top_job_ids),
                    view_weight_factor,
                    already_recommended=set(top_job_ids)
                )
                top_job_ids.extend(fallback_recommendations)
            
            return top_job_ids
        
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return await self._get_fallback_recommendations(user_id, limit, view_weight_factor)

    async def _get_fallback_recommendations(self, user_id, limit, view_weight_factor=0.5, already_recommended=None):
        """
        Fallback untuk mendapatkan rekomendasi pekerjaan jika pengguna tidak memiliki cluster atau jika rekomendasi berbasis cluster gagal
        
        Args:
            user_id (str): Applier ID
            limit (int): Jumlah maksimal rekomendasi pekerjaan
            view_weight_factor (float): Faktor decay (> 0.0, sebaiknya di antara 0.0 ~ 1.0), semakin tinggi semakin tajam decay-nya
            already_recommended (set): ID yang telah direkomendasikan pengguna (menghindari duplikat)
            
        Returns:
            list: List dari job ID yang direkomendasikan
        """
        if already_recommended is None:
            already_recommended = set()
        
        try:
            user_viewed_jobs = await self.log_views_collection.find(
                {"applier_id": ObjectId(user_id)}
            ).to_list(length=None)
            
            user_view_counts = defaultdict(int)
            viewed_job_ids = []
            for log in user_viewed_jobs:
                job_id = str(log["job_id"])
                user_view_counts[job_id] += 1
                viewed_job_ids.append(ObjectId(job_id))
            
            if viewed_job_ids:
                viewed_jobs = await self.job_collection.find(
                    {"_id": {"$in": viewed_job_ids}}
                ).to_list(length=None)
                
                # TODO: Mungkin bisa implement category extraction lalu disini tambah rekomendasi dari category
                #  
                # # Extract categories and tags with weights based on view count
                # category_weights = defaultdict(float)
                # tag_weights = defaultdict(float)
                
                # for job in viewed_jobs:
                #     job_id = str(job["_id"])
                #     view_weight = pow(view_weight_factor, user_view_counts[job_id])
                    
                #     if "category" in job:
                #         category_weights[job["category"]] += view_weight
                    
                #     if "tags" in job and isinstance(job["tags"], list):
                #         for tag in job["tags"]:
                #             tag_weights[tag] += view_weight
                
                # # Get the most weighted categories and tags
                # top_categories = sorted(category_weights.items(), key=lambda x: x[1], reverse=True)[:3]
                # top_categories = [c for c, _ in top_categories]
                
                # top_tags = sorted(tag_weights.items(), key=lambda x: x[1], reverse=True)[:5]
                # top_tags = [t for t, _ in top_tags]
                
                # # Create query for similar jobs
                # query_conditions = []
                
                # if top_categories:
                #     query_conditions.append({"category": {"$in": top_categories}})
                
                # if top_tags:
                #     query_conditions.append({"tags": {"$in": top_tags}})
                
                # if query_conditions:
                #     query = {"$or": query_conditions}
                #     if already_recommended:
                #         query["_id"] = {"$nin": [ObjectId(jid) for jid in already_recommended]}
                    
                #     similar_jobs = await self.job_collection.find(query).limit(limit * 2).to_list(length=None)
                    
                #     # Score jobs based on category and tag matches, applying view weight reduction
                #     job_scores = []
                #     for job in similar_jobs:
                #         job_id = str(job["_id"])
                #         score = 0
                        
                #         # Score based on category match
                #         if "category" in job and job["category"] in category_weights:
                #             score += category_weights[job["category"]]
                        
                #         # Score based on tag matches
                #         if "tags" in job and isinstance(job["tags"], list):
                #             for tag in job["tags"]:
                #                 if tag in tag_weights:
                #                     score += tag_weights[tag]
                        
                #         # Apply view weight reduction if user has viewed this job before
                #         if job_id in user_view_counts:
                #             view_count = user_view_counts[job_id]
                #             weight_reduction = pow(view_weight_factor, view_count)
                #             score *= weight_reduction
                        
                #         job_scores.append((job_id, score))
                    
                #     # Sort by score and get top results
                #     job_scores.sort(key=lambda x: x[1], reverse=True)
                #     top_scores = job_scores[:limit]
                    
                #     if top_scores:
                #         return [job_id for job_id, _ in top_scores]
            
            # Apabila applier tidak memiliki history view, ambil pekerjaan populer
            query = {}
            if already_recommended:
                query["_id"] = {"$nin": [ObjectId(jid) for jid in already_recommended]}
            
            popular_jobs_pipeline = [
                {"$match": query},
                {"$lookup": {
                    "from": "log_views",
                    "localField": "_id",
                    "foreignField": "job_id",
                    "as": "views"
                }},
                {"$project": {
                    "_id": 1,
                    "view_count": {"$size": "$views"}
                }},
                {"$sort": {"view_count": -1}},
                {"$limit": limit * 2}
            ]
            
            popular_jobs = await self.job_collection.aggregate(popular_jobs_pipeline).to_list(length=None)
            
            job_scores = []
            for job in popular_jobs:
                job_id = str(job["_id"])
                score = job["view_count"]
                
                if job_id in user_view_counts:
                    view_count = user_view_counts[job_id]
                    weight_reduction = 1 / (1 + view_count ** view_weight_factor)  # Smoothed Decay
                    score *= weight_reduction
                
                job_scores.append((job_id, score))
            
            job_scores.sort(key=lambda x: x[1], reverse=True)
            top_scores = job_scores[:limit]
            
            if top_scores:
                return [job_id for job_id, _ in top_scores]
            
            # Last resort: return recent jobs
            query = {}
            if already_recommended:
                query["_id"] = {"$nin": [ObjectId(jid) for jid in already_recommended]}
            
            recent_jobs = await self.job_collection.find(query).sort("created_at", -1).limit(limit).to_list(length=None)
            
            return [str(job["_id"]) for job in recent_jobs]
        
        except Exception as e:
            logger.error(f"Error in fallback recommendations: {e}")
            return []