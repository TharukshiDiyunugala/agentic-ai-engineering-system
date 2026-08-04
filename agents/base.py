import os
from typing import Dict, Any

class BaseAgent:
    """
    Base class for all agents in the multi-agent system.
    """
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the agent's logic on the shared workspace state.
        
        Args:
            state (Dict[str, Any]): The current workflow/workspace state.
            
        Returns:
            Dict[str, Any]: The updated workflow state or agent outputs.
        """
        raise NotImplementedError("Each agent must implement the execute method.")
