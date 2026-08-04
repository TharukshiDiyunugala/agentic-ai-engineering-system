from typing import Dict, Any
from agents.base import BaseAgent

class DeveloperAgent(BaseAgent):
    """
    Developer Agent generates source code, implements features, 
    and handles backend/frontend integration.
    """
    def __init__(self):
        super().__init__(name="Developer Agent", role="Software Engineer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Developing source code based on planning tasks...")
        
        tasks = state.get("tasks", [])
        architecture = state.get("architecture", "")
        
        # Simulate developer creating files and source code
        source_code_files = {
            "app/main.py": (
                "from fastapi import FastAPI\n\n"
                "app = FastAPI(title='Task Manager App')\n\n"
                "@app.get('/')\n"
                "def read_root():\n"
                "    return {'status': 'healthy', 'msg': 'Welcome to Task Manager'}\n"
            ),
            "app/models.py": (
                "from pydantic import BaseModel\n\n"
                "class Task(BaseModel):\n"
                "    id: int\n"
                "    title: str\n"
                "    description: str\n"
                "    completed: bool = False\n"
            )
        }
        
        # Simulate moving tasks assigned to developer to "In Progress" or "Done"
        for task in tasks:
            if task.get("assignee") == "Developer":
                task["status"] = "Completed"
                
        state["source_code"] = source_code_files
        state["tasks"] = tasks
        
        print(f"[{self.name}] Development complete. Generated {len(source_code_files)} code files.")
        return state
