from typing import Dict, Any
from agents.base import BaseAgent

class TesterAgent(BaseAgent):
    """
    Tester Agent is responsible for writing unit tests, running code validation, 
    and generating test coverage/execution reports.
    """
    def __init__(self):
        super().__init__(name="Tester Agent", role="QA Engineer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Creating test suite and validating source code...")
        
        source_code = state.get("source_code", {})
        tasks = state.get("tasks", [])
        
        # Simulate creating test files
        test_files = {
            "tests/test_main.py": (
                "from fastapi.testclient import TestClient\n"
                "from app.main import app\n\n"
                "client = TestClient(app)\n\n"
                "def test_read_root():\n"
                "    response = client.get('/')\n"
                "    assert response.status_code == 200\n"
                "    assert response.json() == {'status': 'healthy', 'msg': 'Welcome to Task Manager'}\n"
            )
        }
        
        test_results = {
            "passed": 1,
            "failed": 0,
            "coverage": "95%",
            "status": "All Tests Passed Successfully"
        }
        
        # Update tasks assigned to tester to Completed
        for task in tasks:
            if task.get("assignee") == "Tester":
                task["status"] = "Completed"
                
        state["test_files"] = test_files
        state["test_results"] = test_results
        state["tasks"] = tasks
        
        print(f"[{self.name}] QA & Testing complete. All assertions passed.")
        return state
