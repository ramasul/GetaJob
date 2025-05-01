JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
OTP_EXPIRED_MINUTES = 15

POPULAR_VIEWS_THRESHOLD = 3

CATEGORIES_EN = [
    {
        "name": "Agriculture, Forestry & Fishing",
        "subcategories": [
            "Agriculture",
            "Forestry",
            "Fisheries",
            "Plantation",
            "Livestock"
        ]
    },
    {
        "name": "Mining & Extraction",
        "subcategories": [
            "Coal Mining",
            "Oil & Gas",
            "Metal Ore Mining",
            "Quarrying",
            "Mining Support"
        ]
    },
    {
        "name": "Manufacturing",
        "subcategories": [
            "Food Production",
            "Textile Manufacturing",
            "Wood Products",
            "Paper Products",
            "Chemical Manufacturing",
            "Pharmaceuticals",
            "Rubber & Plastic Products",
            "Metal Products",
            "Electronics Manufacturing",
            "Machinery Manufacturing",
            "Furniture Manufacturing",
            "Automotive Manufacturing"
        ]
    },
    {
        "name": "Utilities",
        "subcategories": [
            "Electricity",
            "Gas Supply",
            "Water Supply",
            "Waste Management",
            "Sanitation"
        ]
    },
    {
        "name": "Construction",
        "subcategories": [
            "Building Construction",
            "Civil Engineering",
            "Specialized Construction",
            "Infrastructure Development",
            "Residential Construction"
        ]
    },
    {
        "name": "Wholesale & Retail Trade",
        "subcategories": [
            "Wholesale Trade",
            "Retail Trade",
            "E-commerce",
            "Traditional Markets",
            "Specialty Retail"
        ]
    },
    {
        "name": "Transportation & Logistics",
        "subcategories": [
            "Land Transportation",
            "Water Transportation",
            "Air Transportation",
            "Warehousing",
            "Postal & Courier Services",
            "Supply Chain"
        ]
    },
    {
        "name": "Accommodation & Food Services",
        "subcategories": [
            "Hotels",
            "Resorts",
            "Restaurants",
            "Food Stalls",
            "Catering Services",
            "Cafes"
        ]
    },
    {
        "name": "Information & Communication",
        "subcategories": [
            "Publishing",
            "Broadcasting",
            "Telecommunications",
            "IT Services",
            "Internet Service Providers",
            "Digital Media"
        ]
    },
    {
        "name": "Financial & Insurance Services",
        "subcategories": [
            "Banking",
            "Insurance",
            "Investments",
            "Financial Technology",
            "Microfinance",
            "Pension Funds"
        ]
    },
    {
        "name": "Real Estate",
        "subcategories": [
            "Property Development",
            "Property Management",
            "Real Estate Agencies",
            "Leasing",
            "Property Valuation"
        ]
    },
    {
        "name": "Professional, Scientific & Technical Services",
        "subcategories": [
            "Legal Services",
            "Accounting & Taxation",
            "Architecture",
            "Engineering",
            "Scientific Research",
            "Advertising & Marketing",
            "Management Consulting",
            "Veterinary"
        ]
    },
    {
        "name": "Administrative & Support Services",
        "subcategories": [
            "Employment Services",
            "Travel Agencies",
            "Security Services",
            "Cleaning Services",
            "Office Administration",
            "Business Support"
        ]
    },
    {
        "name": "Public Administration & Defense",
        "subcategories": [
            "Government Administration",
            "Public Safety",
            "Military & Defense",
            "Regulatory Bodies",
            "Public Policy"
        ]
    },
    {
        "name": "Education",
        "subcategories": [
            "Primary Education",
            "Secondary Education",
            "Higher Education",
            "Vocational Training",
            "Special Education",
            "Education Support"
        ]
    },
    {
        "name": "Healthcare & Social Assistance",
        "subcategories": [
            "Hospitals",
            "Medical Practices",
            "Dental Services",
            "Nursing Care",
            "Mental Health Services",
            "Social Assistance",
            "Child Care",
            "Elderly Care"
        ]
    },
    {
        "name": "Arts, Entertainment & Recreation",
        "subcategories": [
            "Creative Arts",
            "Performance Arts",
            "Museums",
            "Sports & Recreation",
            "Amusement Parks",
            "Gambling & Betting"
        ]
    },
    {
        "name": "Other Services",
        "subcategories": [
            "Religious Organizations",
            "Civic Organizations",
            "Repair & Maintenance",
            "Personal Services",
            "Funeral Services",
            "Domestic Services"
        ]
    },
    {
        "name": "Technology & Digital Economy",
        "subcategories": [
            "Software Development",
            "Hardware Manufacturing",
            "Tech Startups",
            "Artificial Intelligence",
            "Digital Platforms",
            "Cloud Services",
            "Mobile Applications"
        ]
    },
    {
        "name": "Energy",
        "subcategories": [
            "Renewable Energy",
            "Fossil Fuels",
            "Nuclear Energy",
            "Energy Distribution",
            "Energy Efficiency"
        ]
    },
    {
        "name": "Environment & Sustainability",
        "subcategories": [
            "Environmental Services",
            "Waste Management",
            "Recycling",
            "Conservation",
            "Sustainability Consulting"
        ]
    },
    {
        "name": "Traditional & Informal Economy",
        "subcategories": [
            "Traditional Crafts",
            "Street Vendors",
            "Informal Services",
            "Home Industries",
            "Traditional Markets"
        ]
    },
    {
        "name": "NGOs & International Organizations",
        "subcategories": [
            "Non-Profit Organizations",
            "International Aid",
            "Development Organizations",
            "Advocacy Groups",
            "Community Organizations"
        ]
    },
    {
        "name": "General",
        "subcategories": [
            "General Work",
        ]
    }
]

CATEGORIES_ID = [
    {
        "name": "Pertanian, Kehutanan & Perikanan",
        "subcategories": [
            "Pertanian",
            "Kehutanan",
            "Perikanan",
            "Perkebunan",
            "Peternakan"
        ]
    },
    {
        "name": "Pertambangan & Ekstraksi",
        "subcategories": [
            "Pertambangan Batubara",
            "Minyak & Gas",
            "Pertambangan Bijih Logam",
            "Penggalian",
            "Jasa Penunjang Tambang"
        ]
    },
    {
        "name": "Manufaktur",
        "subcategories": [
            "Produksi Makanan",
            "Manufaktur Tekstil",
            "Produk Kayu",
            "Produk Kertas",
            "Manufaktur Kimia",
            "Farmasi",
            "Produk Karet & Plastik",
            "Produk Logam",
            "Manufaktur Elektronik",
            "Manufaktur Mesin",
            "Manufaktur Furnitur",
            "Manufaktur Otomotif"
        ]
    },
    {
        "name": "Utilitas",
        "subcategories": [
            "Listrik",
            "Pasokan Gas",
            "Pasokan Air",
            "Pengelolaan Limbah",
            "Sanitasi"
        ]
    },
    {
        "name": "Konstruksi",
        "subcategories": [
            "Konstruksi Bangunan",
            "Rekayasa Sipil",
            "Konstruksi Khusus",
            "Pembangunan Infrastruktur",
            "Konstruksi Perumahan"
        ]
    },
    {
        "name": "Perdagangan Grosir & Eceran",
        "subcategories": [
            "Perdagangan Grosir",
            "Perdagangan Eceran",
            "Perdagangan Daring (E-commerce)",
            "Pasar Tradisional",
            "Ritel Khusus"
        ]
    },
    {
        "name": "Transportasi & Logistik",
        "subcategories": [
            "Transportasi Darat",
            "Transportasi Air",
            "Transportasi Udara",
            "Pergudangan",
            "Pos & Kurir",
            "Rantai Pasokan"
        ]
    },
    {
        "name": "Akomodasi & Jasa Makanan",
        "subcategories": [
            "Hotel",
            "Resor",
            "Restoran",
            "Warung Makan",
            "Jasa Katering",
            "Kafe"
        ]
    },
    {
        "name": "Informasi & Komunikasi",
        "subcategories": [
            "Penerbitan",
            "Penyiaran",
            "Telekomunikasi",
            "Jasa TI",
            "Penyedia Internet",
            "Media Digital"
        ]
    },
    {
        "name": "Jasa Keuangan & Asuransi",
        "subcategories": [
            "Perbankan",
            "Asuransi",
            "Investasi",
            "Teknologi Keuangan",
            "Lembaga Pembiayaan",
            "Dana Pensiun"
        ]
    },
    {
        "name": "Properti",
        "subcategories": [
            "Pengembang Properti",
            "Manajemen Properti",
            "Agen Properti",
            "Penyewaan",
            "Penilaian Properti"
        ]
    },
    {
        "name": "Jasa Profesional, Ilmiah & Teknis",
        "subcategories": [
            "Jasa Hukum",
            "Akuntansi & Pajak",
            "Arsitektur",
            "Teknik Sipil & Mesin",
            "Riset Ilmiah",
            "Periklanan & Pemasaran",
            "Konsultan Manajemen",
            "Dokter Hewan"
        ]
    },
    {
        "name": "Jasa Administratif & Dukungan",
        "subcategories": [
            "Jasa Ketenagakerjaan",
            "Biro Perjalanan",
            "Jasa Keamanan",
            "Jasa Kebersihan",
            "Administrasi Kantor",
            "Dukungan Bisnis"
        ]
    },
    {
        "name": "Administrasi Publik & Pertahanan",
        "subcategories": [
            "Administrasi Pemerintah",
            "Keamanan Publik",
            "Militer & Pertahanan",
            "Badan Regulator",
            "Kebijakan Publik"
        ]
    },
    {
        "name": "Pendidikan",
        "subcategories": [
            "Pendidikan Dasar",
            "Pendidikan Menengah",
            "Pendidikan Tinggi",
            "Pelatihan Kejuruan",
            "Pendidikan Khusus",
            "Layanan Pendukung Pendidikan"
        ]
    },
    {
        "name": "Kesehatan & Bantuan Sosial",
        "subcategories": [
            "Rumah Sakit",
            "Praktik Medis",
            "Pelayanan Gigi",
            "Perawatan Lansia",
            "Pelayanan Kesehatan Jiwa",
            "Bantuan Sosial",
            "Penitipan Anak",
            "Perawatan Lanjut Usia"
        ]
    },
    {
        "name": "Seni, Hiburan & Rekreasi",
        "subcategories": [
            "Seni Kreatif",
            "Seni Pertunjukan",
            "Museum",
            "Olahraga & Rekreasi",
            "Taman Hiburan",
            "Perjudian & Taruhan"
        ]
    },
    {
        "name": "Jasa Lainnya",
        "subcategories": [
            "Organisasi Keagamaan",
            "Organisasi Masyarakat",
            "Perbaikan & Pemeliharaan",
            "Jasa Pribadi",
            "Jasa Pemakaman",
            "Jasa Rumah Tangga"
        ]
    },
    {
        "name": "Teknologi & Ekonomi Digital",
        "subcategories": [
            "Pengembangan Perangkat Lunak",
            "Manufaktur Perangkat Keras",
            "Startup Teknologi",
            "Kecerdasan Buatan",
            "Platform Digital",
            "Layanan Cloud",
            "Aplikasi Mobile"
        ]
    },
    {
        "name": "Energi",
        "subcategories": [
            "Energi Terbarukan",
            "Bahan Bakar Fosil",
            "Energi Nuklir",
            "Distribusi Energi",
            "Efisiensi Energi"
        ]
    },
    {
        "name": "Lingkungan & Keberlanjutan",
        "subcategories": [
            "Layanan Lingkungan",
            "Pengelolaan Limbah",
            "Daur Ulang",
            "Konservasi",
            "Konsultan Keberlanjutan"
        ]
    },
    {
        "name": "Ekonomi Tradisional & Informal",
        "subcategories": [
            "Kerajinan Tradisional",
            "Pedagang Kaki Lima",
            "Jasa Informal",
            "Industri Rumahan",
            "Pasar Tradisional"
        ]
    },
    {
        "name": "LSM & Organisasi Internasional",
        "subcategories": [
            "Organisasi Nirlaba",
            "Bantuan Internasional",
            "Organisasi Pembangunan",
            "Kelompok Advokasi",
            "Organisasi Komunitas"
        ]
    },
    {
        "name": "Umum",
        "subcategories": [
            "Pekerjaan Umum",
        ]
    }
]

# Untuk Parsing
SKILL_PARSING_QUERY = """Extract the technical or soft skills from the following resume text in JSON format as a list of skill names.
The text might be written in English or Indonesian, so please extract them accordingly.
Return only the JSON object. Do not add any explanation or text before or after it.

Example Input:
"Technical Skills: C/C++, C#, Python, Octave, Teaching. Language: English with ITP TOEFL score 550, Indonesian."

Expected Output:
{{
  "skills": ["C/C++", "C#", "Python", "Octave", "Teaching", "English with 550 ITP Score", "Indonesian"]
}}

Now extract the skills from the following resume text:

\"\"\"
{resume_text}
\"\"\"
Return the result in this exact JSON format:
{{
  "skills": [...]
}}
"""

EDUCATION_PARSING_QUERY = """Extract the education history from the following resume text in JSON format as a list of entries.
The text might be written in English or Indonesian, so please extract them accordingly.
Return only the JSON object. Do not add any explanation or text before or after it.

Each entry should include:
- institution
- degree
- field_of_study
- start_date
- end_date
- gpa (if available)

Example Input:
"Education: B.Sc. in Computer Science, University of Indonesia, 2015-present."

Expected Output:
{{
  "educations": [
    {{
      "institution": "University of Indonesia",
      "degree": "B.Sc.",
      "field_of_study": "Computer Science",
      "start_date": "2015",
      "end_date": "present",
      "gpa": null
    }}
  ]
}}

Now extract the education entries from the following resume text:

\"\"\"
{resume_text}
\"\"\"
Return the result in this exact JSON format:
{{
  "educations": [...]
}}
"""

EXPERIENCE_PARSING_QUERY = """Extract the work experience from the following resume text in JSON format as a list of entries.
The text might be written in English or Indonesian, so please extract them accordingly.
Return only the JSON object. Do not add any explanation or text before or after it.

Each entry should include:
- company
- location (if available)
- position
- start_date
- end_date
- responsibilities (as a list of strings)

Example Input:
"Software Engineer at Tokopedia (Jan 2020 - present). Built backend services and improved performance."

Expected Output:
{{
  "experiences": [
    {{
      "company": "Tokopedia",
      "location": "",
      "position": "Software Engineer",
      "start_date": "Jan 2020",
      "end_date": "present",
      "responsibilities": [
        "Built backend services",
        "Improved performance"
      ]
    }}
  ]
}}

Now extract the experience entries from the following resume text:

\"\"\"
{resume_text}
\"\"\"
Return the result in this exact JSON format:
{{
  "experiences": [...]
}}
"""

ACHIEVEMENT_PARSING_QUERY = """Extract the achievements from the following resume text in JSON format as a list of entries.
The text might be written in English or Indonesian, so please extract them accordingly.
Return only the JSON object. Do not add any explanation or text before or after it.

Each entry should include:
- achievement
- date

Example Input:
"Won 1st place in National Programming Contest, 2022. Published paper on NLP in 2023."

Expected Output:
{{
  "achievements": [
    {{
      "achievement": "Won 1st place in National Programming Contest",
      "date": "2022"
    }},
    {{
      "achievement": "Published paper on NLP",
      "date": "2023"
    }}
  ]
}}

Now extract the achievements from the following resume text:

\"\"\"
{resume_text}
\"\"\"
Return the result in this exact JSON format:
{{
  "achievements": [...]
}}
"""

DESCRIPTION_PARSING_QUERY = """Clean the following introduction text from a resume by removing names, addresses, and unrelated prefixes.
The input may be in English or Indonesian.

Correct Output:
"Undergraduate student in Computer Science with a passion for software development and machine learning."

Wrong Outputs:
- "The cleaned description is: Undergraduate student in Computer Science..."
- {{"description": "Undergraduate student..."}}
- "Here is the cleaned text: Undergraduate student..."

Now clean this introduction text:

\"\"\"
{resume_text}
\"\"\"

Return only the cleaned description as a plain string.
Do not add labels, keys, or any explanation.
"""

LOCATION_PARSING_QUERY = """Extract only the location name from the following resume text. 
Return the result as a plain string with no prefix, explanation, or formatting.

Correct Output:
"Jalan Grafika, Yogyakarta"

Wrong Outputs:
- "The location is: Jalan Grafika, Yogyakarta"
- "Jalan Grafika, Yogyakarta is the location"
- "Location: Jalan Grafika, Yogyakarta"

Now extract the location from this resume text:

\"\"\"
{resume_text}
\"\"\"

Return only the location name as a raw string. No other text, labels, or explanation.
"""

LOCATION_KEYWORDS = [
            "jakarta", "bandung", "yogyakarta", "indonesia", "singapore", 
            "street", "jalan", "city", "provinsi", "kode pos", "semarang",
            "surabaya", "bali", "malang", "medan", "palembang", "batam",
            "bandar lampung", "makassar", "denpasar", "bali", "banten",
            "jakarta selatan", "jakarta barat", "jakarta timur", "jakarta utara",
        ]

