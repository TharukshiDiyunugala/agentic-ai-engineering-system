from typing import Dict, Any
from agents.base import BaseAgent

class PerformanceAgent(BaseAgent):
    """
    Performance Agent analyzes generated source code for execution efficiency,
    complexity concerns, and suggests optimizations.
    """
    def __init__(self):
        super().__init__(name="Performance Agent", role="Performance Engineer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Inspecting source code for performance bottlenecks...")
        
        source_code = state.get("source_code", {})
        bottlenecks = []
        recommendations = []
        
        for file_path, content in source_code.items():
            # Check for simulated nested loop complexity (O(N^2))
            lines = content.split("\n")
            has_nested = False
            for idx, line in enumerate(lines):
                if "for " in line:
                    # check next few lines for nested loop
                    for next_line in lines[idx+1:idx+4]:
                        if "for " in next_line and (len(next_line) - len(next_line.lstrip())) > (len(line) - len(line.lstrip())):
                            has_nested = True
                            break
            
            if has_nested:
                bottlenecks.append({
                    "file": file_path,
                    "issue": "Potential nested loop (O(N^2) complexity) detected.",
                    "severity": "MEDIUM"
                })
                recommendations.append(f"Optimize loop logic in {file_path} using hashing or bulk processing.")

            # Check for database queries or large scans
            if "select * from" in content.lower():
                bottlenecks.append({
                    "file": file_path,
                    "issue": "Select all (*) database query detected without explicit columns or limits.",
                    "severity": "LOW"
                })
                recommendations.append(f"Specify explicit fields and add LIMIT constraints to queries in {file_path}.")

        status = "OPTIMAL" if not bottlenecks else "NEEDS_OPTIMIZATION"
        
        performance_report = {
            "status": status,
            "scanned_files": list(source_code.keys()),
            "bottlenecks": bottlenecks,
            "recommendations": recommendations
        }
        
        state["performance_report"] = performance_report
        
        print(f"[{self.name}] Performance analysis completed. Status: {status}.")
        return state
