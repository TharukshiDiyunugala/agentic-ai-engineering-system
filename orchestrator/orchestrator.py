from typing import Dict, Any
from agents import (
    PlannerAgent,
    DeveloperAgent,
    TesterAgent,
    ReviewerAgent,
    DocumentationAgent,
    DeploymentAgent,
    SecurityAgent
)

class Orchestrator:
    """
    Coordinates and executes collaboration between agents.
    It passes the shared state workspace from one agent to the next.
    """
    def __init__(self):
        self.planner = PlannerAgent()
        self.developer = DeveloperAgent()
        self.tester = TesterAgent()
        self.reviewer = ReviewerAgent()
        self.security = SecurityAgent()
        self.documentation = DocumentationAgent()
        self.deployment = DeploymentAgent()

    def run(self, user_request: str) -> Dict[str, Any]:
        """
        Run the complete multi-agent software engineering workflow sequentially.
        
        Args:
            user_request (str): The main requirements description.
            
        Returns:
            Dict[str, Any]: The final compiled state with all agent outputs.
        """
        print(f"\n[Orchestrator] Starting Multi-Agent AI Workflow for request: '{user_request}'\n" + "="*80)
        
        # Initialize global shared workflow state
        state = {
            "user_request": user_request,
            "development_plan": "",
            "tasks": [],
            "architecture": "",
            "source_code": {},
            "test_files": {},
            "test_results": {},
            "review_summary": {},
            "security_report": {},
            "documentation": "",
            "deployment_files": {},
            "history": []
        }
        
        # 1. Planning Phase
        state = self.planner.execute(state)
        state["history"].append("planning")
        
        # 2. Development Phase
        state = self.developer.execute(state)
        state["history"].append("development")
        
        # 3. QA / Testing Phase
        state = self.tester.execute(state)
        state["history"].append("testing")
        
        # 4. Code Review Phase
        state = self.reviewer.execute(state)
        state["history"].append("review")
        
        # 5. Security Audit Phase
        state = self.security.execute(state)
        state["history"].append("security")
        
        # 6. Documentation Phase
        state = self.documentation.execute(state)
        state["history"].append("documentation")
        
        # 7. Deployment Phase
        state = self.deployment.execute(state)
        state["history"].append("deployment")
        
        print("="*80 + "\n[Orchestrator] Multi-Agent Workflow Completed Successfully!\n")
        return state
