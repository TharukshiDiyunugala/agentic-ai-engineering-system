from typing import Callable, Any

def tool(name: str, description: str):
    """
    Decorator to mark a function as a tool.
    """
    def decorator(func: Callable[..., Any]):
        func.is_tool = True
        func.tool_name = name
        func.tool_description = description
        return func
    return decorator

# Mock tools
@tool(name="read_file", description="Reads the content of a local file")
def read_file(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

@tool(name="write_file", description="Writes content to a local file")
def write_file(file_path: str, content: str) -> str:
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return "File written successfully"
    except Exception as e:
        return f"Error writing file: {str(e)}"
