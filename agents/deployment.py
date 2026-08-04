from typing import Dict, Any
from agents.base import BaseAgent

class DeploymentAgent(BaseAgent):
    """
    Deployment Agent handles creation of Docker configurations, 
    CI/CD configurations, and cloud orchestration manifests.
    """
    def __init__(self):
        super().__init__(name="Deployment Agent", role="DevOps Engineer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Creating Docker configurations and CI/CD workflows...")
        
        dockerfile_content = (
            "FROM python:3.10-slim\n\n"
            "WORKDIR /app\n\n"
            "COPY requirements.txt .\n"
            "RUN pip install --no-cache-dir -r requirements.txt\n\n"
            "COPY . .\n\n"
            "EXPOSE 8000\n"
            "CMD [\"uvicorn\", \"api.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n"
        )
        
        github_action_content = (
            "name: CI Pipeline\n\n"
            "on:\n"
            "  push:\n"
            "    branches: [ main ]\n"
            "  pull_request:\n"
            "    branches: [ main ]\n\n"
            "jobs:\n"
            "  test:\n"
            "    runs-on: ubuntu-latest\n"
            "    steps:\n"
            "      - uses: actions/checkout@v2\n"
            "      - name: Set up Python\n"
            "        uses: actions/setup-python@v2\n"
            "        with:\n"
            "          python-version: '3.10'\n"
            "      - name: Install dependencies\n"
            "        run: pip install -r requirements.txt\n"
            "      - name: Run Tests\n"
            "        run: pytest\n"
        )
        
        deployment_files = {
            "Dockerfile": dockerfile_content,
            ".github/workflows/ci.yml": github_action_content
        }
        
        # Mark deployment tasks completed
        tasks = state.get("tasks", [])
        for task in tasks:
            if task.get("assignee") == "Deployment":
                task["status"] = "Completed"
                
        state["deployment_files"] = deployment_files
        state["tasks"] = tasks
        
        print(f"[{self.name}] Deployment configurations completed.")
        return state
