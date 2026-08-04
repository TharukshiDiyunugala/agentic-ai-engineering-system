import sys
import uvicorn
from api.main import app
from config.settings import settings
from orchestrator.orchestrator import Orchestrator

def run_cli():
    """
    Run a terminal-based interface to interact with the multi-agent system.
    """
    print("\n" + "="*80)
    print("Welcome to the Multi-Agent AI Software Engineering Team CLI!")
    print("="*80 + "\n")
    
    prompt = input("Enter your project requirements: ")
    if not prompt.strip():
        print("Error: Requirements cannot be empty.")
        return
        
    orchestrator = Orchestrator()
    result = orchestrator.run(prompt)
    
    print("\n" + "="*80)
    print("WORKFLOW COMPLETE SUMMARY")
    print("="*80)
    print(f"Project Architecture: {result['architecture']}")
    print(f"Generated Source Files: {list(result['source_code'].keys())}")
    print(f"Generated Test Files: {list(result['test_files'].keys())}")
    print(f"Generated Deployment Files: {list(result['deployment_files'].keys())}")
    print(f"Review Status: {result['review_summary'].get('status')}")
    print("="*80 + "\n")

if __name__ == "__main__":
    # If run with '--cli' flag, run terminal mode
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        run_cli()
    else:
        # Otherwise, run the FastAPI web server
        print(f"Starting API server on http://{settings.HOST}:{settings.PORT}")
        uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
