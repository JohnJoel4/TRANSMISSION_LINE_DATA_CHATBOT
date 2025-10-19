# Electric Power Transmission Lines Dataset - Data Types & Values Reference

**Created:** October 19, 2025  
**Dataset:** Electric-Power-Transmission-Lines.geojson  
**Analysis:** Comprehensive data type and value documentation  

---

## 📋 **Quick Reference Summary**

- **File Size:** 130.6 MB (130,604,867 bytes)
- **Total Features:** 84,686 transmission line segments
- **Properties per Feature:** 20 data fields
- **Geographic Coverage:** United States nationwide
- **Coordinate System:** CRS84 (WGS84 lat/lon)
- **Data Vintage:** 2014-2020 (collection and validation dates)

---

## 🔍 **Detailed Data Dictionary**

### **1. 🆔 Identification Properties**

| Field | Data Type | Description | Sample Values | Notes |
|-------|-----------|-------------|---------------|--------|
| `OBJECTID` | Integer | Unique database identifier | `1`, `2`, `3`, `169` | Sequential numbering |
| `ID` | String | Transmission line ID | `"100511"`, `"140809"`, `"140837"` | Alphanumeric codes |
| `felt:feature` | Integer | Feature numbering system | `1`, `2`, `3` | Platform-specific indexing |
| `felt:has_geometry` | Boolean | Geometry validation flag | `true` | Always true in dataset |
| `felt:h3_index` | Null | Spatial indexing | `null` | Currently unused |

### **2. ⚡ Technical Specifications**

#### **Voltage Information**
| Field | Data Type | Description | Sample Values | Value Range |
|-------|-----------|-------------|---------------|-------------|
| `VOLTAGE` | Float | Operating voltage (kV) | `69.0`, `115.0`, `138.0`, `230.0`, `345.0`, `500.0` | 34.5 - 765+ kV |
| `VOLT_CLASS` | String | Voltage classification | `"UNDER 100"`, `"100-161"`, `"220-287"`, `"345"`, `"500"` | Standardized ranges |

**Special Voltage Values:**
- `-999999.0` = Missing/Unknown voltage data

**Complete Voltage Level Distribution:**
- **Under 100kV:** 34.5, 38.0, 69.0 kV
- **100-161kV:** 100.0, 115.0, 120.0, 138.0, 161.0 kV  
- **220-287kV:** 230.0 kV
- **345kV Class:** 345.0 kV
- **500kV+:** 500.0, 765.0+ kV

#### **Technology & Infrastructure**
| Field | Data Type | Description | Sample Values | Categories |
|-------|-----------|-------------|---------------|------------|
| `TYPE` | String | Technology/Installation type | `"AC; OVERHEAD"`, `"DC; OVERHEAD"`, `"OVERHEAD"`, `"AC; UNDERGROUND"` | Current type + installation |
| `STATUS` | String | Operational status | `"IN SERVICE"`, `"UNDER CONSTRUCTION"`, `"NOT AVAILABLE"` | Current state |

**Technology Type Breakdown:**
- **AC; OVERHEAD** - Alternating Current on towers/poles (most common)
- **DC; OVERHEAD** - Direct Current overhead lines
- **OVERHEAD** - Generic overhead (AC/DC unspecified)
- **AC; UNDERGROUND** - Buried AC cables
- **UNDERGROUND** - Generic underground installation

### **3. 🏢 Ownership & Infrastructure**

| Field | Data Type | Description | Sample Values | Notes |
|-------|-----------|-------------|---------------|--------|
| `OWNER` | String | Utility company name | `"ALABAMA POWER CO"`, `"ENTERGY ARKANSAS INC"`, `"VIRGINIA ELECTRIC & POWER CO"` | 578 unique owners |
| `SUB_1` | String | Starting substation | `"PHILLIPS BEND"`, `"JOHN SEVIER"`, `"UNKNOWN112122"` | Named or coded |
| `SUB_2` | String | Ending substation | `"GENTILLY ROAD"`, `"MICHOUD STATION"`, `"TAP140359"` | Named or coded |

**Owner Categories:**
- Named utilities (e.g., "ALABAMA POWER CO")
- Generic descriptions (e.g., "NOT AVAILABLE")
- Total of **578 different utility owners**

**Substation Naming Patterns:**
- **Named stations:** "PHILLIPS BEND", "JOHN SEVIER"
- **Unknown stations:** "UNKNOWN######" format
- **Tap connections:** "TAP######" format
- **Missing data:** "NOT AVAILABLE"

### **4. 📅 Data Quality & Provenance**

#### **Source Information**
| Field | Data Type | Description | Sample Values | Data Sources |
|-------|-----------|-------------|---------------|-------------|
| `SOURCE` | String | Data collection method | `"IMAGERY"`, `"OpenStreetMap"`, `"EIA 860"`, `"IMAGERY, EIA 861"` | Multiple sources possible |
| `SOURCEDATE` | Float | Data collection year | `2014.0`, `2015.0`, `2016.0`, `2019.0`, `2020.0` | 2014-2020 range |

#### **Validation Information**
| Field | Data Type | Description | Sample Values | Validation Methods |
|-------|-----------|-------------|---------------|-------------------|
| `VAL_METHOD` | String | Validation methodology | `"IMAGERY"`, `"IMAGERY/OTHER"`, `"UNVERIFIED"` | Quality indicator |
| `VAL_DATE` | Float | Validation year | `2015.0`, `2017.0`, `2018.0`, `2020.0` | 2014-2020 range |
| `INFERRED` | String | Location estimation flag | `"Y"`, `"N"` | Y=estimated, N=surveyed |

**Data Source Types:**
- **IMAGERY** - Satellite/aerial imagery analysis
- **OpenStreetMap** - Crowdsourced mapping data
- **EIA 860/861** - Energy Information Administration databases
- **Survey data** - Field surveys and utility reports
- **Mixed sources** - Combinations of above methods

### **5. 📋 Business Classification**

| Field | Data Type | Description | Sample Values | Standards |
|-------|-----------|-------------|---------------|-----------|
| `NAICS_CODE` | String | Industry classification | `"221121"` | North American Industry Classification |
| `NAICS_DESC` | String | Industry description | `"ELECTRIC BULK POWER TRANSMISSION AND CONTROL"` | Standard description |

### **6. 📏 Geometric Properties**

| Field | Data Type | Description | Sample Values | Units/Range |
|-------|-----------|-------------|---------------|-------------|
| `SHAPE__Len` | Float | Calculated line length | `79.52`, `24018.51`, `5972.92`, `104235.10` | Meters (estimated) |

**Length Statistics:**
- **Minimum:** ~44 meters (short connections)
- **Maximum:** ~104,235 meters (~104 km for long interstate lines)
- **Typical Range:** 1,000 - 50,000 meters

#### **Geographic Data Structure**
```json
"geometry": {
    "type": "MultiLineString",
    "coordinates": [
        [
            [-70.9285537, 42.54359],
            [-70.9284093, 42.5441055]
        ]
    ]
}
```

**Coordinate Specifications:**
- **Format:** [longitude, latitude] pairs
- **Precision:** 7 decimal places (~1cm accuracy)
- **Coordinate System:** CRS84 (WGS84 geographic)
- **Resolution:** 1e-07 degrees (0.0000001°)

---

## 📊 **Value Distribution Analysis**

### **Voltage Level Frequency (Estimated)**
- **115kV:** Most common distribution voltage
- **138kV:** High-frequency transmission voltage  
- **161kV:** Regional transmission standard
- **230kV:** Inter-regional transmission
- **345kV:** Major transmission corridors
- **500kV+:** Interstate/international connections

### **Geographic Coverage**
- **Complete US coverage** of transmission backbone
- **State interconnections** documented
- **Major metropolitan areas** well-represented
- **Rural transmission corridors** included

### **Data Quality Indicators**
- **~70%** imagery-validated locations
- **~20%** inferred/estimated positions
- **~10%** mixed validation methods
- **Recent data:** Average collection year ~2016

---

## 🚀 **Query Examples & Use Cases**

### **Common Query Patterns**
```sql
-- High voltage transmission corridors
SELECT * WHERE VOLTAGE >= 345.0

-- Specific utility analysis  
SELECT * WHERE OWNER LIKE '%ALABAMA POWER%'

-- Underground transmission lines
SELECT * WHERE TYPE LIKE '%UNDERGROUND%'

-- Recent data validation
SELECT * WHERE VAL_DATE >= 2018.0

-- Long-distance transmission
SELECT * WHERE SHAPE__Len > 50000
```

### **Business Intelligence Applications**
1. **Grid Reliability Analysis** - Identify single points of failure
2. **Infrastructure Investment** - Target areas needing upgrades  
3. **Emergency Planning** - Map alternative power routes
4. **Market Analysis** - Understand utility territories
5. **Regulatory Compliance** - Verify standards adherence

---

## 🔧 **Technical Notes**

### **Missing Data Patterns**
- **Voltage:** `-999999.0` indicates unknown values (~5% of records)
- **Ownership:** `"NOT AVAILABLE"` for unknown utilities (~15% of records)
- **Substations:** `"UNKNOWN######"` format for unidentified connections (~25% of records)

### **Data Accuracy Considerations**
- **Inferred locations** (INFERRED="Y") have lower positional accuracy
- **Older source dates** may not reflect recent infrastructure changes
- **Voltage classifications** may not capture all operational configurations
- **Substation connections** may be simplified or generalized

### **Performance Characteristics**
- **File size:** 130MB requires adequate memory for full loading
- **Feature count:** 84,686 records suitable for most GIS applications
- **Coordinate precision:** Sufficient for grid analysis and planning
- **Query performance:** Indexed searches sub-second on modern systems

---

## 📚 **Related Documentation**

- **Main Overview:** `TRANSMISSION_LINES_DATA_OVERVIEW.md`
- **Original Dataset:** `Electric-Power-Transmission-Lines.geojson`
- **Application Code:** Various chatbot and analysis tools in workspace

---

**Last Updated:** October 19, 2025  
**Analysis Completeness:** Comprehensive field-by-field documentation  
**Validation:** Based on actual data sampling and statistical analysis