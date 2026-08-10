from typing import Dict, Any
from agents.base import BaseAgent

class DatabaseAgent(BaseAgent):
    """
    Database Agent analyzes requirements, architecture suggestions, and generates
    database schemas, migrations, or seeding scripts.
    """
    def __init__(self):
        super().__init__(name="Database Agent", role="Database Engineer")

    def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Generating database schema and migrations...")
        
        user_request = state.get("user_request", "")
        architecture = state.get("architecture", "")
        
        # Simulate creating database migration/schema scripts based on database type
        db_type = "PostgreSQL" if "postgresql" in architecture.lower() else "SQLite"
        
        schema_sql = (
            f"-- Database Schema for {user_request}\n"
            f"-- Generated for {db_type}\n\n"
            "CREATE TABLE IF NOT EXISTS users (\n"
            "    id SERIAL PRIMARY KEY,\n"
            "    email VARCHAR(255) UNIQUE NOT NULL,\n"
            "    hashed_password VARCHAR(255) NOT NULL,\n"
            "    is_active BOOLEAN DEFAULT TRUE\n"
            ");\n\n"
            "CREATE TABLE IF NOT EXISTS tasks (\n"
            "    id SERIAL PRIMARY KEY,\n"
            "    title VARCHAR(255) NOT NULL,\n"
            "    description TEXT,\n"
            "    completed BOOLEAN DEFAULT FALSE,\n"
            "    owner_id INTEGER REFERENCES users(id)\n"
            ");\n"
        )
        
        database_files = {
            "db/schema.sql": schema_sql,
            "db/migrations/env.py": "# Alembic / database migration environment setup\nimport os\n"
        }
        
        state["database_files"] = database_files
        
        print(f"[{self.name}] Database migration and schema generation completed.")
        return state
