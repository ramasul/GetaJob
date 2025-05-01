import os
import shutil
from typing import List
import uuid
from fastapi import APIRouter, Depends, File, Query, UploadFile, status

from app.ai_services.ocr import OCR
from app.ai_services.pdf_parser import *

router = APIRouter(prefix="/resume", tags=["Resume"])

async def get_ocr_controller() -> OCR:
    api_key = 'helloworld'
    language = 'eng'
    overlay = False
    return OCR(api_key, language, overlay)

@router.post("/parse/image_text", response_model=ParserResponse, status_code=status.HTTP_200_OK)
async def extract_text_from_pdf(
    file: UploadFile = File(...),
    controller: OCR = Depends(get_ocr_controller)
):
    """API untuk mengekstrak teks dari file PDF menggunakan OCR"""
    temp_filename = f"/tmp/{uuid.uuid4()}.pdf"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    OCR_result = await controller.ocr_space_file(temp_filename)
    OCR_result_clean = OCR_result.strip()
    parser = ResumeParser(text=OCR_result_clean)
    result = parser.parse()

    os.remove(temp_filename)

    return result    
    

@router.post("/parse/pdf_text", response_model=ParserResponse, status_code=status.HTTP_200_OK)
async def parse_pdf_text(
    file: UploadFile = File(...),
):
    """API untuk mengekstrak teks dari file PDF yang dapat dideteksi teksnya"""
    temp_filename = f"/tmp/{uuid.uuid4()}.pdf"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    controller = ResumeParser(filepath=temp_filename)
    result = controller.parse()

    os.remove(temp_filename)

    return result

