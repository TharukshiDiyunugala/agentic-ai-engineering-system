from typing import Dict, Any, List, TypedDict
from langgraph.graph import StateGraph, END

# Import agents
from agents import (
    PlannerAgent,
    DeveloperAgent,
    TesterAgent,
    ReviewerAgent,
    DocumentationAgent,
    DeploymentAgent,
    SecurityAgent,
    NotificationAgent,
    PerformanceAgent,
    DatabaseAgent
)

# Define the workflow state schema
class AgentState(TypedDict):
    user_request: str
    development_plan: str
    tasks: List[Dict[str, Any]]
    architecture: str
    source_code: Dict[str, str]
    database_files: Dict[str, str]
    test_files: Dict[str, str]
    test_results: Dict[str, Any]
    review_summary: Dict[str, Any]
    security_report: Dict[str, Any]
    performance_report: Dict[str, Any]
    documentation: str
    deployment_files: Dict[str, str]
    notification_report: Dict[str, Any]
    history: List[str]

# Instantiate agents
planner_agent = PlannerAgent()
developer_agent = DeveloperAgent()
database_agent = DatabaseAgent()
tester_agent = TesterAgent()
reviewer_agent = ReviewerAgent()
security_agent = SecurityAgent()
performance_agent = PerformanceAgent()
documentation_agent = DocumentationAgent()
deployment_agent = DeploymentAgent()
notification_agent = NotificationAgent()

# Define node functions wrapper
def plan_node(state: AgentState) -> Dict[str, Any]:
    output = planner_agent.execute(state)
    output["history"].append("planner")
    return output

def develop_node(state: AgentState) -> Dict[str, Any]:
    output = developer_agent.execute(state)
    output["history"].append("developer")
    return output

def database_node(state: AgentState) -> Dict[str, Any]:
    output = database_agent.execute(state)
    output["history"].append("database")
    return output

def test_node(state: AgentState) -> Dict[str, Any]:
    output = tester_agent.execute(state)
    output["history"].append("tester")
    return output

def review_node(state: AgentState) -> Dict[str, Any]:
    output = reviewer_agent.execute(state)
    output["history"].append("reviewer")
    return output

def security_node(state: AgentState) -> Dict[str, Any]:
    output = security_agent.execute(state)
    output["history"].append("security")
    return output

def performance_node(state: AgentState) -> Dict[str, Any]:
    output = performance_agent.execute(state)
    output["history"].append("performance")
    return output

def document_node(state: AgentState) -> Dict[str, Any]:
    output = documentation_agent.execute(state)
    output["history"].append("documentation")
    return output

def deploy_node(state: AgentState) -> Dict[str, Any]:
    output = deployment_agent.execute(state)
    output["history"].append("deployment")
    return output

def notification_node(state: AgentState) -> Dict[str, Any]:
    output = notification_agent.execute(state)
    output["history"].append("notification")
    return output

# Conditional router function (e.g. to go back to developer if review fails)
def route_review(state: AgentState) -> str:
    summary = state.get("review_summary", {})
    if summary.get("status") == "APPROVED":
        return "security"
    else:
        # If rejected, route back to development
        print("[Orchestrator Node Router] Code was REJECTED. Routing back to developer...")
        return "developer"

def create_workflow() -> StateGraph:
    """
    Builds the LangGraph state machine representing the SDLC workflow.
    """
    # Initialize graph with state schema
    workflow = StateGraph(AgentState)
    
    # Add nodes to graph
    workflow.add_node("planner", plan_node)
    workflow.add_node("developer", develop_node)
    workflow.add_node("database", database_node)
    workflow.add_node("tester", test_node)
    workflow.add_node("reviewer", review_node)
    workflow.add_node("security", security_node)
    workflow.add_node("performance", performance_node)
    workflow.add_node("documentation", document_node)
    workflow.add_node("deployment", deploy_node)
    workflow.add_node("notification", notification_node)
    
    # Set entry point
    workflow.set_entry_point("planner")
    
    # Add simple transitions
    workflow.add_edge("planner", "developer")
    workflow.add_edge("developer", "database")
    workflow.add_edge("database", "tester")
    workflow.add_edge("tester", "reviewer")
    
    # Add conditional edge based on review outcomes
    workflow.add_conditional_edges(
        "reviewer",
        route_review,
        {
            "developer": "developer",        # Feedback loop
            "security": "security"           # Proceed if approved
        }
    )
    
    workflow.add_edge("security", "performance")
    workflow.add_edge("performance", "documentation")
    workflow.add_edge("documentation", "deployment")
    workflow.add_edge("deployment", "notification")
    workflow.add_edge("notification", END)
    
    return workflow.compile()
