# San Francisco Transmission Lines - Natural Language Query System

This project provides a natural language interface for querying electrical transmission line data using a React frontend and Python FastAPI backend.

## Project Structure

```
San_fransico/
├── backend.py                           # FastAPI backend server
├── nli_parser.py                        # Natural language parser
├── requirements.txt                     # Python dependencies
├── start_backend.bat                    # Windows startup script
├── Electric-Power-Transmission-Lines.geojson  # GeoJSON data file
└── chatbot-maps-frontend/               # React frontend
    ├── src/
    │   ├── App.js                       # Main React component
    │   ├── MapComponent.js              # Leaflet map component
    │   └── Chatbot.js                   # Chat interface
    └── package.json                     # Node.js dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. **Install Python Dependencies**:
   ```bash
   # Navigate to the project root
   cd "c:\Users\johnj\OneDrive\Desktop\San_fransico"
   
   # Install Python packages
   pip install -r requirements.txt
   ```

2. **Start the Backend Server**:
   ```bash
   # Option 1: Use the batch file (Windows)
   start_backend.bat
   
   # Option 2: Manual start
   uvicorn backend:app --reload --port 8000
   ```

   The backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Install Node.js Dependencies**:
   ```bash
   cd chatbot-maps-frontend
   npm install
   ```

2. **Start the React Development Server**:
   ```bash
   npm start
   ```

   The frontend will be available at: `http://localhost:3000`

## Usage

### Supported Query Types

1. **Voltage Filtering**:
   - "Show me all 500kV lines"
   - "345kV transmission lines"
   - "230kV lines"

2. **Type Filtering**:
   - "Show underground lines"
   - "Overhead transmission lines"

3. **Status Filtering**:
   - "Lines under construction"
   - "In service lines"

4. **Aggregation Queries**:
   - "Which utility owns the most lines?"

### Example Queries
- "Show me all 500kV lines"
- "Which utility owns the most lines?"
- "Underground transmission lines"
- "Lines under construction"

## API Endpoints

### POST /api/query
Process natural language queries and return filtered GeoJSON data.

**Request Body**:
```json
{
  "query": "Show me all 500kV lines"
}
```

**Response**:
```json
{
  "text_response": "Found 1,234 500kV lines totaling 5,678 units. Lines displayed on map.",
  "geojson_data": {
    "type": "FeatureCollection",
    "features": [...]
  }
}
```

### GET /health
Check if the backend is running and data is loaded.

### GET /info
Get information about the loaded dataset including available columns and sample data.

## Troubleshooting

### Backend Issues

1. **GeoPandas Installation Problems**:
   - On Windows, you might need to install GeoPandas using conda:
     ```bash
     conda install geopandas
     ```

2. **Data Loading Errors**:
   - Ensure `Electric-Power-Transmission-Lines.geojson` is in the same directory as `backend.py`
   - Check the console output for specific error messages

3. **CORS Issues**:
   - The backend is configured to allow all origins for development
   - For production, update the CORS settings in `backend.py`

### Frontend Issues

1. **API Connection Errors**:
   - Ensure the backend is running on port 8000
   - Check browser console for network errors
   - Verify the API URL in `App.js` is correct

2. **Map Not Loading**:
   - Check that the GeoJSON data is being received
   - Verify Leaflet and react-leaflet dependencies are installed

## Development Notes

### Extending the Natural Language Parser

To add new query types, modify `nli_parser.py`:

```python
# Add new voltage levels
if "115kv" in query_lower:
    filter_conditions["VOLTAGE"] = "115kV"
    text_prompt = "115kV lines"

# Add new status types
if "proposed" in query_lower:
    filter_conditions["STATUS"] = "Proposed"
    text_prompt = "proposed lines"
```

### Data Schema

The GeoJSON file should contain features with properties including:
- `VOLTAGE`: Voltage level (e.g., "500kV", "345kV")
- `OWNER`: Utility company name
- `STATUS`: Line status (e.g., "In Service", "Under Construction")
- `TYPE`: Line type (e.g., "OVERHEAD", "UNDERGROUND")
- `SHAPE__Len`: Line length for calculations

## Production Deployment

For production deployment:

1. Update CORS settings in `backend.py`
2. Set up proper authentication if needed
3. Use a production WSGI server like Gunicorn
4. Build the React app: `npm run build`
5. Serve the built React app with a web server

## License

This project is for educational and demonstration purposes.