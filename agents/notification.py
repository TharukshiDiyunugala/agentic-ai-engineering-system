from typing import Dict, Any
from agents.base import BaseAgent

class NotificationAgent(BaseAgent):
    """
    Notification Agent prepares build/release status summaries 
    and simulates dispatching notifications (Slack, Email, webhooks).
    """
    def __init__(self):
        super().__init__(name="Notification Agent", role="DevOps Coordinator")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Compiling execution summary and sending notifications...")
        
        user_request = state.get("user_request", "")
        test_results = state.get("test_results", {})
        review_summary = state.get("review_summary", {})
        security_report = state.get("security_report", {})
        
        # Compile a summary report
        notification_report = {
            "project": user_request,
            "status": "SUCCESS" if review_summary.get("status") == "APPROVED" and security_report.get("status") == "SECURE" else "WARNING",
            "channels_notified": ["Slack", "Email"],
            "summary": {
                "test_status": "PASS" if test_results.get("summary", {}).get("failed", 0) == 0 else "FAIL",
                "code_review": review_summary.get("status", "PENDING"),
                "security_audit": security_report.get("status", "PENDING")
            }
        }
        
        state["notification_report"] = notification_report
        
        print(f"[{self.name}] Notification dispatched successfully. Status: {notification_report['status']}")
        return state
