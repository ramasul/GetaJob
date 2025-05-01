import fitz
import json 
import re
import os
import logging
from typing import List

from app.ai_services.llm import GroqAPI
from app.models.resume_model import *
from app.utils.constants import LOCATION_KEYWORDS, SKILL_PARSING_QUERY, LOCATION_PARSING_QUERY, EDUCATION_PARSING_QUERY, EXPERIENCE_PARSING_QUERY, ACHIEVEMENT_PARSING_QUERY, DESCRIPTION_PARSING_QUERY

logger = logging.getLogger("resume_parser_module")

class ResumeParser:
    """Parsing otomatis resume PDF dengan menggunakan AI."""
    
    def __init__(self, filepath: str = None, text: str = None):
        """
        Inisialisasi ResumeParser dengan file PDF atau teks resume.
        
        Args:
            filepath: Path ke file PDF resume
            text: Teks hasil OCR apabila PDF tidak terbaca            
        """
        self.groq = GroqAPI(api_key=os.getenv("GROQ_API_KEY"))
        self.filepath = filepath if filepath else None
        self.text = self._extract_text() if filepath else text
        
        self.section_keywords = {
            "skills": ["skill", "skills", "kemampuan", "keahlian", "technical skills", "kecakapan", "ability", "abilities",
                       "skills and abilities"],
            "achievements": ["achievement", "achievements", "pencapaian", "prestasi", "penghargaan", "certification", "sertifikat", "certifications"],
            "educations": ["education", "educations", "pendidikan", "riwayat pendidikan"],
            "experiences": ["experience", "experiences", "pengalaman", "work history", "riwayat pekerjaan", "riwayat jabatan", "organization"
                            "organisasi", "organizations", "organizational", "work experience", "work experiences"]
        }
       
        self.all_keywords = [kw for section_kws in self.section_keywords.values() for kw in section_kws]
        
        self.location_keywords = LOCATION_KEYWORDS
        self.sections = self._identify_sections()

    def _extract_text(self) -> str:
        """Ekstrak semua teks dari file PDF."""
        try:
            doc = fitz.open(self.filepath)
            text = ''
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    async def parse(self) -> ParserResponse:
        """
        Fungsi Parsing Resume 
        
        Returns:
            ParserResponse: Structured resume data
        """
        return ParserResponse(
            personal_information=await self._extract_personal_info(self.sections),
            skills=await self._clean_skill_section(),
            achievements=await self._clean_achievement_section(),
            educations=await self._clean_education_section(),
            experiences=await self._clean_experience_section()
        )
    
    async def _clean_skill_section(self) -> List[ApplierSkills]:
        skills_text = self._extract_section_content("skills", self.sections)
        if not skills_text:
            return []
        combined_text = "\n".join(skills_text)

        query = SKILL_PARSING_QUERY.format(resume_text=combined_text)
        response = await self.groq.get_response(query, temperature=0)

        try:
            parsed = json.loads(response)
            skills = parsed.get("skills", [])
            return [ApplierSkills(skill=skill_name) for skill_name in skills]
        except Exception as e:
            logger.error(f"Failed to parse skills JSON: {e}")
            return []
    
    async def _clean_achievement_section(self) -> List[ApplierAchievements]:
        achievements_text = self._extract_section_content("achievements", self.sections)
        if not achievements_text:
            return []
        combined_text = "\n".join(achievements_text)

        query = ACHIEVEMENT_PARSING_QUERY.format(resume_text=combined_text)
        response = await self.groq.get_response(query, temperature=0)

        try:
            parsed = json.loads(response)
            achievements = parsed.get("achievements", [])
            return [ApplierAchievements(achievement=achievement["achievement"], date=achievement["date"]) for achievement in achievements]
        except Exception as e:
            logger.error(f"Failed to parse achievements JSON: {e}")
            return []
    
    async def _clean_education_section(self) -> List[ApplierEducation]:
        educations_text = self._extract_section_content("educations", self.sections)
        if not educations_text:
            return []
        combined_text = "\n".join(educations_text)

        query = EDUCATION_PARSING_QUERY.format(resume_text=combined_text)
        response = await self.groq.get_response(query, temperature=0)

        try:
            parsed = json.loads(response)
            educations = parsed.get("educations", [])
            return [ApplierEducation(
                institution=education["institution"],
                degree=education["degree"],
                field_of_study=education["field_of_study"],
                start_date=education["start_date"],
                end_date=education["end_date"],
                gpa = str(education.get("gpa"))
            ) for education in educations]
        except Exception as e:
            logger.error(f"Failed to parse education JSON: {e}")
            return []
    
    async def _clean_experience_section(self) -> List[ApplierExperience]:
        experiences_text = self._extract_section_content("experiences", self.sections)
        if not experiences_text:
            return []
        combined_text = "\n".join(experiences_text)

        query = EXPERIENCE_PARSING_QUERY.format(resume_text=combined_text)
        response = await self.groq.get_response(query, temperature=0)

        try:
            parsed = json.loads(response)
            experiences = parsed.get("experiences", [])
            return [ApplierExperience(
                company=experience["company"],
                location=experience["location"],
                position=experience["position"],
                start_date=experience["start_date"],
                end_date=experience["end_date"],
                responsibilities=experience["responsibilities"]
            ) for experience in experiences]
        except Exception as e:
            logger.error(f"Failed to parse experience JSON: {e}")
            return []
 
    def _identify_sections(self) -> dict:
        """
        Mengidentifikasi bagian-bagian resume berdasarkan kata kunci.
        Hanya mempertimbangkan kata kunci yang muncul sebagai kata depan bagian khusus, bukan yang ada dalam kalimat.
        Menggabungkan teks dari bagian yang sama.
        
        Returns:
            dict: Dictionary yang memetakan nama bagian ke posisi (start, end) dalam teks
        """
        section_positions = []
        
        for section_name, keywords in self.section_keywords.items():
            for keyword in keywords:
                # Aturan keyword, ditulis biar Rama nggak lupa yang dia coding sendiri
                pattern = re.compile(
                    # Keyword harus muncul di awal atau setelah line break
                    rf'(?:^|\n)[ \t]*'
                    # Maksimal 3 huruf sebelum keyword
                    rf'(?:\S{{0,3}}[ \t]*)?'
                    # Ini adalah keyword yang kita cari
                    rf'({re.escape(keyword)})'
                    # Setelah keyword boleh ada karakter lain
                    rf'[ \t]*(?::|●|•|\*|-|–|\.|\s|$)',
                    re.IGNORECASE
                )
                
                for match in pattern.finditer(self.text):
                    pos = match.start(1)
                    
                    line_start = max(0, self.text.rfind('\n', 0, pos) + 1)
                    line_end = self.text.find('\n', pos)
                    if line_end == -1:
                        line_end = len(self.text)
                    full_line = self.text[line_start:line_end].strip()
                    
                    word_count = len(full_line.split())
                    
                    # Hanya ambil bagian yang memenuhi kriteria:
                    # 1. Ada di awal baris atau ada sedikit karakter sebelum keyword
                    # 2. Memiliki 3 kata atau kurang
                    if len(self.text[line_start:pos].strip()) <= 3 and word_count <= 4:
                        section_positions.append((pos, section_name))
        
        section_positions.sort()
        
        if not section_positions:
            return {"personal": [(0, len(self.text))]}
        
        sections = {}
        for i, (pos, section_name) in enumerate(section_positions):
            header_end = self.text.find('\n', pos)
            if header_end == -1: 
                header_end = len(self.text)
            start = header_end + 1
            
            if i + 1 < len(section_positions):
                next_header_pos = section_positions[i+1][0]
                next_line_start = max(0, self.text.rfind('\n', 0, next_header_pos) + 1)
                end = next_line_start
            else:
                end = len(self.text)
            
            if section_name not in sections:
                sections[section_name] = []
            sections[section_name].append((start, end))
        
        if section_positions:
            first_section_pos = section_positions[0][0]
            first_line_start = max(0, self.text.rfind('\n', 0, first_section_pos) + 1)
            sections["personal"] = [(0, first_line_start)]
        else:
            sections["personal"] = [(0, len(self.text))]
        
        return sections

    async def _extract_personal_info(self, sections: dict) -> PersonalInformation:
        """
        Ekstrak informasi pribadi dari bagian resume yang sesuai.
        
        Args:
            sections: Hasil identifikasi section resume
            
        Returns:
            PersonalInformation: Structured personal information
        """
        if "personal" not in sections or not sections["personal"]:
            return PersonalInformation()
            
        start, end = sections["personal"][0]
        personal_text = self.text[start:end]
        
        lines = [line.strip() for line in personal_text.splitlines() if line.strip()]
        
        name = lines[0] if lines else ""
        
        email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
        email_matches = re.finditer(email_pattern, personal_text)
        emails = [match.group(0) for match in email_matches]
        email = ", ".join(emails) if emails else ""
        
        phone_patterns = [
            r"(?:(?:\+62|62|0)\s?8[1-9][0-9]{1,}[-\s]?[0-9]{1,}[-\s]?[0-9]{1,})",
            r"(?:(?:\+62|62|0)\s?8[1-9][0-9]{7,})",
            r"\+?[0-9]{1,4}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}",
            r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b"
        ]
        
        phone = ""
        for pattern in phone_patterns:
            phone_match = re.search(pattern, personal_text)
            if phone_match:
                phone = phone_match.group(0)
                break
        
        description_lines = []
        
        for line in lines[1:]: 
            if len(line.split()) > 8:
                description_lines.append(line)
        
        description = " ".join(description_lines)
        
        location = self._extract_location(personal_text)

        description = await self.groq.get_response(DESCRIPTION_PARSING_QUERY.format(resume_text=description), temperature=0)
        location = await self.groq.get_response(LOCATION_PARSING_QUERY.format(resume_text=location), temperature=0)

        return PersonalInformation(
            name=name,
            email=email,
            phone=phone,
            description=description,
            location=location
        )
    
    def _extract_location(self, text: str) -> str:
        """
        Ekstrak informasi lokasi dari teks resume.
            
        Returns:
            str: Extracted location line or empty string
        """
        for line in text.splitlines():
            for keyword in self.location_keywords:
                if keyword.lower() in line.lower():
                    return line.strip()
        return ""

    def _extract_section_content(self, section_name: str, sections: dict) -> List[str]:
        """
        Ekstrak konten dari bagian resume berdasarkan nama bagian.
        Sudah menghandle banyak instance dari bagian yang sama dengan menggabungkan kontennya.
        
        Args:
            section_name: Name of the section to extract
            sections: Dictionary mapping section names to list of position ranges
            
        Returns:
            List[str]: List of items from the section
        """
        if section_name not in sections:
            return []
        
        all_items = []
        
        for start, end in sections[section_name]:
            section_text = self.text[start:end]            
            items = self._parse_section_items(section_text)
            all_items.extend(items)
        
        return all_items
    
    def _parse_section_items(self, text: str) -> List[str]:
        """
        Parse section text into individual items, preserving line breaks.
        
        Args:
            text: Section text content
            
        Returns:
            List[str]: Parsed items, one per line
        """
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        
        items = []
        for line in lines:
            cleaned_line = line.lstrip('·•*-o◦ ')
            if cleaned_line:
                items.append(cleaned_line)
        
        return items

