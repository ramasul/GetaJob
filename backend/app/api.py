import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Depends
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config.db import Database
from app.config.database_indexes import create_log_view_indexes

from app.routes.applier_routes import router as applier_router
from app.routes.recruiter_routes import router as recruiter_router
from app.routes.auth_routes import router as auth_router
from app.routes.job_routes import router as job_router
from app.routes.logView_routes import router as log_view_router
from app.routes.recommendation_route import router as recommendation_router

load_dotenv()
# Konfigurasi logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GetaJob API",
    description="API untuk aplikasi GetaJob",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Masukkan semua route yang telah dibuat ke dalam app
app.include_router(applier_router)
app.include_router(recruiter_router)
app.include_router(auth_router)
app.include_router(job_router)
app.include_router(log_view_router)
app.include_router(recommendation_router)

api_router = APIRouter()


@api_router.get("/", response_class=HTMLResponse)
async def root():
    return HTMLResponse(
        content="""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>GetaJob API</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="flex items-center justify-center min-h-screen bg-gray-100">
            <div class="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
                <h1 class="text-2xl font-bold text-gray-800">Selamat datang di API GetaJob</h1>
                <p class="mt-4 text-gray-600">Endpoints:</p>
                <div class="mt-6 space-y-3">
                    <a href="/appliers" class="block bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                        /appliers
                    </a>
                    <a href="/recruiters" class="block bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                        /recruiters
                    </a>
                    <a href="/jobs" class="block bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                        /jobs
                    </a>
                    <a href="/job_applications" class="block bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                        /job_applications
                    </a>
                    <a href="/docs" class="block bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                        Documentation
                    </a>
                </div>
            </div>
        </body>
    </html>
    """,
        status_code=200,
        media_type="text/html",
    )


# Health check
@api_router.get("/health")
async def health_check():
    try:
        # Cek koneksi ke database
        db = Database.get_db()
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


app.include_router(api_router)


# Startup and shutdown events
@app.on_event("startup")
async def startup_db_client():
    db_url = os.getenv("MONGODB_URI")
    await Database.connect_db(db_url)

    db = Database.get_db()
    logger.info("Creating database indexes...")
    await create_log_view_indexes(db)
    logger.info("Database indexes created successfully")

    logger.info("Connected to the MongoDB database!")


@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_db()
    logger.info("Disconnected from the MongoDB database")


# Menjalanakan aplikasi FastAPI
if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.api:app", host="0.0.0.0", port=port)
