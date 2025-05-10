import os
import json
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.ai_services.llm import GroqAPI
from app.models.resume_model import RecruiterRateResume, ApplierRateResume, ApplierAskJob
from app.controllers.applier_controller import ApplierController
from app.controllers.job_controller import JobController
from app.utils.constants import RECRUITER_RATE_RESUME_QUERY, APPLIER_RATE_RESUME_QUERY, APPLIER_ASK_JOB_QUERY

logger = logging.getLogger(__name__)

class ResumeService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.applier_controller = ApplierController(database)
        self.job_controller = JobController(database)
        self.groq = GroqAPI(api_key=os.getenv("GROQ_API_KEY"))
    
    async def get_resume_score(self, applier_id: str) -> ApplierRateResume:
        applier_data = await self.applier_controller.get_applier(applier_id)
        resume_data = applier_data.resume_parsed
        skills_list = [skill.skill for skill in resume_data.skills]
        achievements_list = [f"{achievement.achievement} {achievement.date}" for achievement in resume_data.achievements]
        educations_list = [f"{education.field_of_study} {education.degree} {education.institution}" for education in resume_data.educations]
        experiences_list = [f"{experience.position} - {experience.company}, {experience.location} from {experience.start_date} to {experience.end_date}" for experience in resume_data.experiences]

        query = APPLIER_RATE_RESUME_QUERY.format(
            personal_information=resume_data.personal_information,
            skills=skills_list,
            achievements=achievements_list,
            educations=educations_list,
            experiences=experiences_list
        )

        response = await self.groq.get_response(prompt=query, temperature=0.3)
        try:
            response_json = json.loads(response)
            score = str(response_json.get("score"))
            strengths = response_json.get("strengths")
            suggestions = response_json.get("suggestions")
            return ApplierRateResume(score=score, strengths=strengths, suggestions=suggestions)
        except Exception as e:
            logger.error(f"Error parsing response: {e}")
            return ApplierRateResume(score="", strengths="", suggestions="")

    async def get_applier_resume_score(self, applier_id: str, job_id: str) -> RecruiterRateResume:
        applier_data = await self.applier_controller.get_applier(applier_id)
        job_data = await self.job_controller.get_job(job_id)
        resume_data = applier_data.resume_parsed
        skills_list = [skill.skill or '' for skill in resume_data.skills]
        educations_list = [f"{education.field_of_study or ''} {education.degree or ''} {education.institution or ''}" for education in resume_data.educations]
        achievements_list = [f"{achievement.achievement or ''} {achievement.date or ''}" for achievement in resume_data.achievements]
        experiences_list = [f"{(experience.position + '-') or ''} {(experience.company + ',') or ''} {experience.location or ''} { ('from' + experience.start_date) or ''} { ('to' + experience.end_date) or ''}" for experience in resume_data.experiences]

        query = RECRUITER_RATE_RESUME_QUERY.format(
            skills=skills_list,
            educations=educations_list,
            achievements=achievements_list,
            experiences=experiences_list,
            job_title=job_data.job_title,
            minimum_education=job_data.minimum_education,
            required_skills=job_data.required_skills,
            description=job_data.description,
        )

        response = await self.groq.get_response(prompt=query, temperature=0.3)
        try:
            response_json = json.loads(response)
            score = str(response_json.get("score"))
            explanation = response_json.get("explanation")
            return RecruiterRateResume(score=score, explanation=explanation)
        except Exception as e:
            logger.error(f"Error parsing response: {e}")
            return RecruiterRateResume(score="", explanation="")
        
    async def get_applier_ask_job(self, applier_id: str, job_id: str) -> ApplierAskJob:
        applier_data = await self.applier_controller.get_applier(applier_id)
        job_data = await self.job_controller.get_job(job_id)
        resume_data = applier_data.resume_parsed
        skills_list = [skill.skill for skill in resume_data.skills]
        educations_list = [f"{education.field_of_study} {education.degree} {education.institution}" for education in resume_data.educations]
        achievements_list = [f"{achievement.achievement} {achievement.date}" for achievement in resume_data.achievements]
        experiences_list = [f"{experience.position} - {experience.company}, {experience.location} from {experience.start_date} to {experience.end_date}" for experience in resume_data.experiences]

        query = APPLIER_ASK_JOB_QUERY.format(
            skills=skills_list,
            educations=educations_list,
            achievements=achievements_list,
            experiences=experiences_list,
            job_title=job_data.job_title,
            minimum_education=job_data.minimum_education,
            required_skills=job_data.required_skills,
            description=job_data.description,
        )

        response = await self.groq.get_response(prompt=query, temperature=0.3)
        try:
            response_json = json.loads(response)
            suitability = response_json.get("suitability")
            explanation = response_json.get("explanation")
            suggestions = response_json.get("suggestions")
            return ApplierAskJob(suitability=suitability, explanation=explanation, suggestions=suggestions)
        except Exception as e:
            logger.error(f"Error parsing response: {e}")
            return ApplierAskJob(answer="")