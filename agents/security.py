from typing import Dict, Any
from agents.base import BaseAgent

class SecurityAgent(BaseAgent):
    """
    Security Agent scans source code for hardcoded secrets, eval usage, 
    and checks compliance with basic security standards.
    """
    def __init__(self):
        super().__init__(name="Security Agent", role="Security Engineer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Scanning code for security vulnerabilities...")
        
        source_code = state.get("source_code", {})
        vulnerabilities = []
        
        for file_path, content in source_code.items():
            # Basic vulnerability checks (static analysis simulation)
            if "eval(" in content:
                vulnerabilities.append({
                    "file": file_path,
                    "issue": "Use of unsafe eval() function detected.",
                    "severity": "HIGH"
                })
            if "password =" in content.lower() or "secret =" in content.lower():
                vulnerabilities.append({
                    "file": file_path,
                    "issue": "Potential hardcoded secret or credential detected.",
                    "severity": "CRITICAL"
                })
        
        status = "SECURE" if not vulnerabilities else "FLAGGED"
        
        security_report = {
            "status": status,
            "scanned_files": list(source_code.keys()),
            "vulnerabilities": vulnerabilities
        }
        
        state["security_report"] = security_report
        
        print(f"[{self.name}] Security scan completed. Status: {status}.")
        return state
