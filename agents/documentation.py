from typing import Dict, Any
from agents.base import BaseAgent

class DocumentationAgent(BaseAgent):
    """
    Documentation Agent generates markdown documentation, README files, 
    API documentations, and installation/user guides.
    """
    def __init__(self):
        super().__init__(name="Documentation Agent", role="Technical Writer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Generating markdown documentation and API guides...")
        
        user_request = state.get("user_request", "")
        
        documentation = (
            f"# Generated Documentation for: {user_request}\n\n"
            "## Architecture Overview\n"
            "The system is built as a microservice using FastAPI.\n\n"
            "## API Endpoints\n"
            "- `GET /`: Health check and greeting.\n"
            "- `GET /docs`: Auto-generated OpenAPI interactive Swagger docs.\n\n"
            "## Installation Instructions\n"
            "1. Activate virtual environment.\n"
            "2. Run `pip install -r requirements.txt`.\n"
            "3. Execute `python main.py` to start the backend.\n"
        )
        
        state["documentation"] = documentation
        
        print(f"[{self.name}] Documentation successfully generated.")
        return state
