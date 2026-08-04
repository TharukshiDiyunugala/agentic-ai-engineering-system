from typing import Dict, Any
from agents.base import BaseAgent

class PlannerAgent(BaseAgent):
    """
    Planner Agent is responsible for requirement analysis, task decomposition, 
    architecture suggestion, and generating an implementation roadmap.
    """
    def __init__(self):
        super().__init__(name="Planner Agent", role="Project Manager & Architect")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Analyzing requirements and generating planning documents...")
        
        user_request = state.get("user_request", "")
        
        # Simulate planning logic using LLM or structured output templates
        development_plan = f"--- DEVELOPMENT PLAN FOR: {user_request} ---\n"
        development_plan += "1. Project Setup and Configuration\n"
        development_plan += "2. Core API Development\n"
        development_plan += "3. Frontend / UI Implementation\n"
        development_plan += "4. Integration & Deployment Setup\n"
        
        tasks = [
            {"id": "TASK-1", "title": "Setup repository structure and dependencies", "status": "Todo", "assignee": "Developer"},
            {"id": "TASK-2", "title": "Implement database schemas and models", "status": "Todo", "assignee": "Developer"},
            {"id": "TASK-3", "title": "Implement authentication endpoints", "status": "Todo", "assignee": "Developer"},
            {"id": "TASK-4", "title": "Write unit tests for authentication logic", "status": "Todo", "assignee": "Tester"},
            {"id": "TASK-5", "title": "Create CI/CD GitHub Actions workflow", "status": "Todo", "assignee": "Deployment"}
        ]
        
        architecture_suggestion = (
            "Suggested Stack: FastAPI (Python), SQLite (Development) / PostgreSQL (Production), "
            "React/Next.js (Frontend), Docker containerization."
        )

        state["development_plan"] = development_plan
        state["tasks"] = tasks
        state["architecture"] = architecture_suggestion
        
        print(f"[{self.name}] Planning completed. Created {len(tasks)} tasks.")
        return state
