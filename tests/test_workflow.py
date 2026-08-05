from orchestrator.orchestrator import Orchestrator

def test_sequential_orchestrator_flow():
    """
    Test that the Orchestrator successfully runs all agents and 
    returns a completed state with all expected fields.
    """
    orchestrator = Orchestrator()
    prompt = "Create a task management app with SQLite database"
    
    state = orchestrator.run(prompt)
    
    # Assert correct inputs and keys are populated
    assert state["user_request"] == prompt
    assert "development_plan" in state
    assert len(state["tasks"]) > 0
    assert "architecture" in state
    assert "source_code" in state
    assert "test_files" in state
    assert "test_results" in state
    assert "review_summary" in state
    assert "security_report" in state
    assert "documentation" in state
    assert "deployment_files" in state
    
    # Assert sequential flow history
    assert state["history"] == ["planning", "development", "testing", "review", "security", "documentation", "deployment"]
    
    # Assert review approved
    assert state["review_summary"]["status"] == "APPROVED"
