from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from orchestrator.orchestrator import Orchestrator

app = FastAPI(
    title="Multi-Agent AI SE Team API",
    description="Backend API orchestrating specialized planning, development, QA, and DevOps agents.",
    version="1.0.0"
)

# Instantiate the orchestration layer
orchestrator = Orchestrator()

class BuildRequest(BaseModel):
    requirement: str

class BuildResponse(BaseModel):
    user_request: str
    development_plan: str
    tasks: List[Dict[str, Any]]
    architecture: str
    source_code: Dict[str, str]
    test_files: Dict[str, str]
    test_results: Dict[str, Any]
    review_summary: Dict[str, Any]
    documentation: str
    deployment_files: Dict[str, str]
    history: List[str]

@app.get("/")
def health_check():
    """
    Check API health and status.
    """
    return {"status": "online", "system": "Multi-Agent AI Software Engineering Team"}

@app.post("/build", response_model=BuildResponse)
def build_project(request: BuildRequest):
    """
    Triggers the multi-agent workflow sequence to design, write, test, review, and configure deployment.
    """
    if not request.requirement.strip():
        raise HTTPException(status_code=400, detail="Requirement prompt cannot be empty.")
    
    try:
        result = orchestrator.run(request.requirement)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow failed: {str(e)}")
