"""
Company Matching System for jobX
Handles AI-powered matching between candidates and companies
"""

import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
import asyncio

router = APIRouter()

# Sample company database (in production, this would be a real database)
COMPANIES_DATABASE = [
    {
        "id": "comp_001",
        "name": "TechCorp Inc",
        "industry": "Technology",
        "size": "100-500",
        "location": "San Francisco, CA",
        "remote_friendly": True,
        "open_positions": [
            {
                "id": "pos_001",
                "title": "Senior Frontend Developer",
                "department": "Engineering",
                "level": "Senior",
                "skills_required": ["React", "JavaScript", "TypeScript", "CSS"],
                "experience_required": "4-6 years",
                "salary_range": {"min": 120000, "max": 160000},
                "work_type": "remote",
                "description": "Build amazing user interfaces with React and modern web technologies"
            },
            {
                "id": "pos_002", 
                "title": "Full Stack Engineer",
                "department": "Engineering",
                "level": "Mid",
                "skills_required": ["Node.js", "React", "Python", "AWS"],
                "experience_required": "2-4 years",
                "salary_range": {"min": 90000, "max": 130000},
                "work_type": "hybrid",
                "description": "Full-stack development with modern technologies"
            }
        ]
    },
    {
        "id": "comp_002",
        "name": "StartupXYZ",
        "industry": "Fintech",
        "size": "10-50",
        "location": "New York, NY",
        "remote_friendly": True,
        "open_positions": [
            {
                "id": "pos_003",
                "title": "Backend Developer",
                "department": "Engineering", 
                "level": "Mid",
                "skills_required": ["Python", "Django", "PostgreSQL", "Docker"],
                "experience_required": "3-5 years",
                "salary_range": {"min": 95000, "max": 125000},
                "work_type": "remote",
                "description": "Build scalable backend systems for fintech platform"
            }
        ]
    },
    {
        "id": "comp_003",
        "name": "Enterprise Solutions Ltd",
        "industry": "Enterprise Software",
        "size": "500+",
        "location": "Austin, TX",
        "remote_friendly": False,
        "open_positions": [
            {
                "id": "pos_004",
                "title": "DevOps Engineer",
                "department": "Infrastructure",
                "level": "Senior",
                "skills_required": ["AWS", "Kubernetes", "Terraform", "Python"],
                "experience_required": "5-8 years",
                "salary_range": {"min": 130000, "max": 180000},
                "work_type": "onsite",
                "description": "Manage cloud infrastructure and deployment pipelines"
            }
        ]
    }
]

class CandidateProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    experience: str
    skills: str
    preferred_roles: str
    salary_expectation: str
    work_type: str
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    additional_info: Optional[str] = None

class MatchingRequest(BaseModel):
    candidate_profile: CandidateProfile
    interview_transcript: Optional[str] = None
    interview_analysis: Optional[Dict[str, Any]] = None

class MatchingResult(BaseModel):
    candidate_id: str
    matches: List[Dict[str, Any]]
    total_matches: int
    created_at: datetime

class CompanyMatch(BaseModel):
    company_id: str
    company_name: str
    position_id: str
    position_title: str
    match_score: float
    match_reasons: List[str]
    salary_range: Dict[str, int]
    work_type: str
    location: str

def calculate_match_score(candidate: CandidateProfile, position: Dict[str, Any]) -> tuple[float, List[str]]:
    """Calculate match score between candidate and position"""
    score = 0.0
    reasons = []
    
    # Skills matching (40% weight)
    candidate_skills = [skill.strip().lower() for skill in candidate.skills.split(',')]
    required_skills = [skill.strip().lower() for skill in position['skills_required']]
    
    skills_match = len(set(candidate_skills) & set(required_skills)) / len(required_skills)
    score += skills_match * 0.4
    if skills_match > 0.5:
        reasons.append(f"Strong skills match: {skills_match:.1%}")
    
    # Experience matching (25% weight)
    candidate_exp = candidate.experience
    required_exp = position['experience_required']
    
    # Simple experience matching logic
    if "senior" in position['level'].lower() and "7-10" in candidate_exp or "10+" in candidate_exp:
        score += 0.25
        reasons.append("Experience level matches senior position")
    elif "mid" in position['level'].lower() and "4-6" in candidate_exp or "2-3" in candidate_exp:
        score += 0.25
        reasons.append("Experience level matches mid-level position")
    elif "junior" in position['level'].lower() and "0-1" in candidate_exp or "2-3" in candidate_exp:
        score += 0.25
        reasons.append("Experience level matches junior position")
    
    # Work type matching (20% weight)
    if candidate.work_type == position['work_type'] or candidate.work_type == 'any':
        score += 0.2
        reasons.append(f"Work type preference matches: {position['work_type']}")
    
    # Salary matching (15% weight)
    try:
        # Parse salary expectation (simple parsing)
        if candidate.salary_expectation:
            # Extract numbers from salary expectation
            import re
            numbers = re.findall(r'\d+', candidate.salary_expectation)
            if numbers:
                candidate_salary = int(numbers[0]) * 1000  # Assume first number is in thousands
                min_salary = position['salary_range']['min']
                max_salary = position['salary_range']['max']
                
                if min_salary <= candidate_salary <= max_salary:
                    score += 0.15
                    reasons.append("Salary expectation within range")
    except:
        pass  # Skip salary matching if parsing fails
    
    return min(score, 1.0), reasons

@router.post("/match-candidates", response_model=MatchingResult)
async def match_candidates(request: MatchingRequest):
    """Match candidate with companies based on profile and interview"""
    candidate_id = str(uuid.uuid4())
    matches = []
    
    # Get all companies and their positions
    for company in COMPANIES_DATABASE:
        for position in company['open_positions']:
            score, reasons = calculate_match_score(request.candidate_profile, position)
            
            # Only include matches with score > 0.3
            if score > 0.3:
                match = {
                    "company_id": company['id'],
                    "company_name": company['name'],
                    "position_id": position['id'],
                    "position_title": position['title'],
                    "match_score": round(score, 2),
                    "match_reasons": reasons,
                    "salary_range": position['salary_range'],
                    "work_type": position['work_type'],
                    "location": company['location'],
                    "description": position['description'],
                    "department": position['department'],
                    "level": position['level']
                }
                matches.append(match)
    
    # Sort by match score (highest first)
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    
    return MatchingResult(
        candidate_id=candidate_id,
        matches=matches,
        total_matches=len(matches),
        created_at=datetime.now()
    )

@router.get("/companies")
async def get_companies():
    """Get all companies in database"""
    return {"companies": COMPANIES_DATABASE, "total": len(COMPANIES_DATABASE)}

@router.get("/companies/{company_id}")
async def get_company(company_id: str):
    """Get specific company details"""
    for company in COMPANIES_DATABASE:
        if company['id'] == company_id:
            return company
    raise HTTPException(status_code=404, detail="Company not found")

@router.post("/apply-to-company")
async def apply_to_company(candidate_id: str, company_id: str, position_id: str):
    """Simulate applying candidate to specific company position"""
    # In production, this would:
    # 1. Create application record
    # 2. Send application to company
    # 3. Track application status
    # 4. Send notifications
    
    return {
        "status": "success",
        "message": f"Application submitted to {company_id} for position {position_id}",
        "application_id": str(uuid.uuid4()),
        "applied_at": datetime.now().isoformat()
    }

@router.get("/candidate-matches/{candidate_id}")
async def get_candidate_matches(candidate_id: str):
    """Get all matches for a specific candidate"""
    # In production, this would query the database
    return {
        "candidate_id": candidate_id,
        "matches": [],
        "message": "No matches found for this candidate"
    }
