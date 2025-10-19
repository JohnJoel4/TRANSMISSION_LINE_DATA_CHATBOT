# nli_parser.py

def parse_query(query: str) -> dict:
    """
    Translates a natural language query into a structured action/filter dictionary.
    This is a heavily simplified NLI and can be expanded using libraries like SpaCy or LLMs.
    """
    query_lower = query.lower()

    # --- 1. Aggregation Queries (for statistical answers) ---

    if "owns the most lines" in query_lower:
        return {
            "type": "aggregate",
            "action": "group_by",
            "group_by": "OWNER",
            "metric": "count",
            "text_prompt": "utility owns the most lines"
        }
    
    # --- 2. Filtering Queries (for map visualization) ---

    filter_conditions = {}
    text_prompt = query

    # VOLTAGE filtering (e.g., "500kV")
    if "500kv" in query_lower:
        filter_conditions["VOLTAGE"] = 500.0
        text_prompt = "500kV lines"
    elif "345kv" in query_lower:
        filter_conditions["VOLTAGE"] = 345.0
        text_prompt = "345kV lines"
    elif "230kv" in query_lower:
        filter_conditions["VOLTAGE"] = 230.0
        text_prompt = "230kV lines"
    elif "138kv" in query_lower:
        filter_conditions["VOLTAGE"] = 138.0
        text_prompt = "138kV lines"
    elif "765kv" in query_lower:
        filter_conditions["VOLTAGE"] = 765.0
        text_prompt = "765kV lines"
    elif "161kv" in query_lower:
        filter_conditions["VOLTAGE"] = 161.0
        text_prompt = "161kV lines"
    elif "115kv" in query_lower:
        filter_conditions["VOLTAGE"] = 115.0
        text_prompt = "115kV lines"
    elif "high voltage" in query_lower or "hv" in query_lower:
        filter_conditions["VOLTAGE_MIN"] = 345.0
        text_prompt = "high voltage lines (345kV+)"
        
    # TYPE filtering (e.g., "underground")
    if "underground" in query_lower:
        # We'll need to use a different approach for underground since it can be "AC; UNDERGROUND" or "UNDERGROUND"
        filter_conditions["TYPE_CONTAINS"] = "UNDERGROUND"
        text_prompt = "underground lines"
    elif "overhead" in query_lower:
        # Similar for overhead - can be "AC; OVERHEAD", "OVERHEAD", etc.
        filter_conditions["TYPE_CONTAINS"] = "OVERHEAD"
        text_prompt = "overhead lines"
        
    # STATUS filtering (e.g., "under construction")
    if "under construction" in query_lower:
        filter_conditions["STATUS"] = "UNDER CONSTRUCTION"
        text_prompt = "lines under construction"
    elif "in service" in query_lower:
        filter_conditions["STATUS"] = "IN SERVICE"
        text_prompt = "lines in service"

    # Default action is always to filter if conditions are found
    if filter_conditions:
        return {
            "type": "filter",
            "conditions": filter_conditions,
            "text_prompt": text_prompt
        }
    
    # Default fallback: return a placeholder for text-only processing
    return {
        "type": "text_only",
        "text_prompt": f"I received the query: {query}. (No specific filter applied yet.)"
    }