# backend.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import geopandas as gpd
import pandas as pd
import json
import os

from nli_parser import parse_query # Import the NLI function

# --- 1. FastAPI Setup ---
app = FastAPI(title="Grid Data API")

# Setup CORS to allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CSP headers to allow eval for development
from fastapi.responses import Response

@app.middleware("http")
async def add_csp_header(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "script-src 'self' 'unsafe-eval' 'unsafe-inline';"
    return response

# --- 2. Data Loading (Executed Once on Startup) ---
DATA_FILE = "Electric-Power-Transmission-Lines.geojson"
gdf = None # Global GeoDataFrame

@app.on_event("startup")
async def load_data():
    global gdf
    print("⚡ Starting data load...")
    try:
        # Load the GeoJSON file into a GeoDataFrame
        # NOTE: You MUST have your GeoJSON file in the same directory as this script.
        gdf = gpd.read_file(DATA_FILE)
        
        # Ensure 'SHAPE__Len' is a float for aggregation
        if 'SHAPE__Len' in gdf.columns:
            gdf['SHAPE__Len'] = pd.to_numeric(gdf['SHAPE__Len'], errors='coerce')
        
        print(f"✅ Data loaded successfully: {len(gdf)} features indexed.")
        print(f"📊 Available columns: {list(gdf.columns)}")
        
        # Print some sample data to understand the structure
        if len(gdf) > 0:
            print(f"📋 Sample data:")
            for col in ['VOLTAGE', 'OWNER', 'STATUS', 'TYPE']:
                if col in gdf.columns:
                    unique_values = gdf[col].value_counts().head(5)
                    print(f"   {col}: {list(unique_values.index)}")
                    
    except Exception as e:
        print(f"🛑 ERROR loading data: {e}")
        # In a real app, you would log this error and potentially exit.
        
# --- 3. Request/Response Models ---

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    text_response: str
    geojson_data: dict

# --- 4. Core Query Endpoint ---

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    if gdf is None:
        raise HTTPException(status_code=503, detail="Data not yet loaded or failed to load.")

    # 1. Parse the Natural Language Query
    parsed_action = parse_query(request.query)
    action_type = parsed_action.get("type")
    
    # 2. Handle Aggregation Queries (Statistical Answers)
    if action_type == "aggregate":
        group_by = parsed_action.get("group_by")
        
        # Perform group-by aggregation
        if group_by in gdf.columns:
            result = gdf.groupby(group_by).size().reset_index(name='Count')
            # Get the top entry
            top_result = result.sort_values(by='Count', ascending=False).iloc[0]
            
            text = (f"The utility that {parsed_action.get('text_prompt')} "
                    f"is **{top_result[group_by]}** with {top_result['Count']} lines.")
            
            # For aggregate queries, return the whole map data for context
            return QueryResponse(
                text_response=text,
                geojson_data=json.loads(gdf.to_json())
            )

    # 3. Handle Filtering Queries (Map Visualization)
    elif action_type == "filter":
        conditions = parsed_action.get("conditions")
        
        # Build the filtering mask
        filter_mask = pd.Series([True] * len(gdf)) # Start with all True
        
        for prop, value in conditions.items():
            if prop == "TYPE_CONTAINS":
                # Handle substring matching for TYPE field
                if "TYPE" in gdf.columns:
                    filter_mask &= gdf["TYPE"].str.contains(value, case=False, na=False)
            elif prop == "VOLTAGE_MIN":
                # Handle minimum voltage filtering
                if "VOLTAGE" in gdf.columns:
                    filter_mask &= (gdf["VOLTAGE"] >= value)
            elif prop in gdf.columns:
                filter_mask &= (gdf[prop] == value)
        
        filtered_gdf = gdf[filter_mask]
        
        # Calculate summary statistics
        num_lines = len(filtered_gdf)
        total_length = filtered_gdf['SHAPE__Len'].sum() if 'SHAPE__Len' in filtered_gdf.columns else 'N/A'
        
        # Generate text response
        if isinstance(total_length, float) and not pd.isna(total_length):
            text = (f"Found **{num_lines:,}** {parsed_action.get('text_prompt')} "
                    f"totaling **{total_length:,.0f}** units. Lines displayed on map.")
        else:
            text = (f"Found **{num_lines:,}** {parsed_action.get('text_prompt')}. "
                    f"Lines displayed on map.")

        # Return filtered GeoJSON data
        return QueryResponse(
            text_response=text,
            geojson_data=json.loads(filtered_gdf.to_json())
        )
        
    # 4. Handle Text-Only/Fallback Queries
    else:
        text = f"I only recognize specific analytical terms like '500kV', 'underground', or 'owns the most lines'. Please refine your query."
        # Return empty GeoJSON data on unrecognized queries to clear the map
        empty_geojson = {"type": "FeatureCollection", "features": []}
        return QueryResponse(text_response=text, geojson_data=empty_geojson)

# --- 5. Health Check Endpoint ---
@app.get("/health")
async def health_check():
    return {"status": "healthy", "data_loaded": gdf is not None}

# --- 6. Data Info Endpoint ---
@app.get("/info")
async def data_info():
    if gdf is None:
        return {"error": "Data not loaded"}
    
    info = {
        "total_features": len(gdf),
        "columns": list(gdf.columns),
        "sample_data": {}
    }
    
    # Add sample values for key columns
    for col in ['VOLTAGE', 'OWNER', 'STATUS', 'TYPE']:
        if col in gdf.columns:
            info["sample_data"][col] = gdf[col].value_counts().head(10).to_dict()
    
    return info