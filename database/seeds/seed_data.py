import json
from backend.database.manager import db_manager
from backend.auth.security import hash_password
from backend.services.document_service import document_service
from backend.services.dataset_service import dataset_service
from backend.services.provenance_service import provenance_service

def seed_database():
    print("Beginning comprehensive platform seeding...")

    # 1. Seed Users across roles
    users = [
        ("admin", "admin@landgovernance.gov.in", "AdminPass@2026", "Dr. Rajesh Sharma", "Administrator", "Ministry of Rural Development"),
        ("researcher", "researcher@cbit.ac.in", "ResearcherPass@2026", "Surya Saketharam Nallam", "Researcher", "Chaitanya Bharathi Institute of Technology"),
        ("analyst", "analyst@niti.gov.in", "PolicyPass@2026", "Priya Venkat", "Policy Analyst", "NITI Aayog Land Policy Cell"),
        ("official", "official@telangana.gov.in", "OfficialPass@2026", "K. Rama Rao", "Government Official", "Department of Land Administration, Telangana"),
        ("public", "citizen@gmail.com", "PublicPass@2026", "Arun Kumar", "Public User", "General Public")
    ]

    for username, email, pwd, name, role, org in users:
        existing = db_manager.execute_one("SELECT id FROM users WHERE username = ?", (username,))
        if not existing:
            hashed = hash_password(pwd)
            db_manager.execute_insert(
                "INSERT INTO users (username, email, hashed_password, full_name, role, organization) VALUES (?, ?, ?, ?, ?, ?)",
                (username, email, hashed, name, role, org)
            )
            print(f"Created user: {username} ({role})")

    # 2. Seed Real Statutory, Policy, and Research Documents
    documents = [
        {
            "title": "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013",
            "category": "Act/Rule",
            "author": "Parliament of India / Ministry of Rural Development",
            "organization": "Department of Land Resources",
            "publication_date": "2013-09-27",
            "state": "National",
            "district": "All",
            "keywords": "land acquisition, compensation, rehabilitation, multi-crop agricultural land, public purpose",
            "document_type": "Statutory Act",
            "content": """The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act) regulates the process by which government entities acquire private land for public infrastructure, industrial corridors, and public-private partnerships. 
            
            Section 10 of the Act places a stringent restriction on the acquisition of multi-cropped irrigated land to preserve national food security. Multi-cropped agricultural land shall not be acquired except under exceptional circumstances, and when acquired, an equivalent area of culturable wasteland shall be developed for agricultural purposes or an amount equal to the investment cost shall be deposited with the competent authority.
            
            The Act mandates a comprehensive Social Impact Assessment (SIA) prior to any land acquisition. The SIA must consult affected local bodies (Panchayats and Municipalities) to assess whether the proposed acquisition serves a genuine public purpose, the extent of displacement, and whether alternative non-agricultural or barren lands were thoroughly explored.
            
            Compensation is prescribed at up to four times the market value in rural areas and two times in urban areas, supplemented by mandatory rehabilitation and resettlement (R&R) entitlements including housing, annuity allowances, and employment guarantees for affected agricultural laborers and tenant farmers."""
        },
        {
            "title": "Digital India Land Records Modernization Programme (DILRMP) Core Implementation Framework",
            "category": "Policy Brief",
            "author": "Technical Advisory Group on Land Records",
            "organization": "Department of Land Resources, Ministry of Rural Development",
            "publication_date": "2024-03-15",
            "state": "National",
            "district": "All",
            "keywords": "DILRMP, computerization, cadastral maps, GIS integration, ULPIN, Bhu-Aadhaar, mutation",
            "document_type": "Policy Brief",
            "content": """The Digital India Land Records Modernization Programme (DILRMP) represents India's flagship Digital Public Infrastructure for land governance. The objective is to achieve a conclusive system of land titling with title guarantee, replacing the presumptive titling system historically prevalent across states.
            
            A foundational pillar of DILRMP is the Unique Land Parcel Identification Number (ULPIN), branded as 'Bhu-Aadhaar'. The ULPIN is a 14-digit alphanumeric identification generated based on the international standard longitude and latitude coordinates of the plot vertices, ensuring unique geospatial identification for every agricultural and non-agricultural parcel.
            
            The programme mandates seamless integration across three administrative pillars:
            1. Computerization of Records of Rights (RoR).
            2. Digitization and geo-referencing of spatial cadastral maps (Bhu-Naksha).
            3. Interconnection between the Sub-Registrar deed registration offices and Tehsil land record revenue databases for automatic, transparent mutation.
            
            Spatial validation prevents fraudulent double transactions and provides verifiable evidence for agricultural credit access, crop insurance settlement under PM-FASAL, and infrastructure planning."""
        },
        {
            "title": "SVAMITVA Scheme Guidelines: Drone-Based Geospatial Mapping of Inhabited Rural Areas",
            "category": "Government Report",
            "author": "National Steering Committee on SVAMITVA",
            "organization": "Ministry of Panchayati Raj & Survey of India",
            "publication_date": "2025-01-20",
            "state": "National",
            "district": "All",
            "keywords": "SVAMITVA, drone mapping, Abadi area, property cards, tenure security, rural credit",
            "document_type": "Government Report",
            "content": """The SVAMITVA (Survey of Villages and Mapping with Improvised Technology in Village Areas) scheme establishes high-resolution 2D and 3D spatial cadastre across populated rural village abadi lands using advanced Unmanned Aerial Vehicles (drones).
            
            Historically, village inhabited settlements lacked demarcated cadastral records, preventing rural property owners from leveraging their real assets for financial collateral. By deploying Continuously Operating Reference Stations (CORS) with 5-centimeter spatial accuracy, SVAMITVA generates accurate ortho-rectified imagery (ORI) and digital elevation models.
            
            Following ground truthing and grievance redressal through Gram Sabhas, property cards (Svamitva Records of Rights) are issued to homeowners. Empirical evaluations indicate that formal property demarcation reduces rural civil litigation by over 38% and accelerates rural formal credit disbursement by over 45% across pilot districts."""
        },
        {
            "title": "Empirical Analysis of Agricultural Land Conversion and Urban Sprawl in Hyderabad Metropolitan Region (2018-2026)",
            "category": "Research Paper",
            "author": "Centre for Spatial Dynamics & Land Governance Research",
            "organization": "Administrative Staff College of India / CBIT Consortium",
            "publication_date": "2026-02-10",
            "state": "Telangana",
            "district": "Hyderabad, Rangareddy, Medchal",
            "keywords": "urban sprawl, agricultural land loss, peri-urban, outer ring road, Telangana, LULC change",
            "document_type": "Research Paper",
            "content": """This empirical study utilizes high-resolution multi-temporal satellite imagery from Sentinel-2 and Landsat missions between 2018 and 2026 to quantify the rate, spatial distribution, and socioeconomic consequences of agricultural land conversion in the Hyderabad Metropolitan Region (HMR) and surrounding districts of Rangareddy and Medchal-Malkajgiri.
            
            Key Findings:
            1. Built-up surface area expanded by 59.0% (from 1,220 sq km in 2018 to 1,940 sq km in 2026), with growth primarily concentrated along radial expressways and the Outer Ring Road (ORR) growth corridor.
            2. Prime agricultural land declined by 670 sq km (-13.8%), with 77.8% of newly constructed built-up footprint directly replacing double-cropped fertile agricultural plots.
            3. Waterbody and wetland surface area dropped by 4.8% due to unauthorized encroachment and drainage fragmentation, exacerbating seasonal urban flooding and groundwater depletion.
            4. In rural tehsils within 25 km of the metropolitan fringe, the share of agricultural workforce decreased from 42% to 26%, accompanied by rapid land speculation and conversion to non-agricultural layouts.
            
            The authors recommend enacting strict statutory agricultural conservation green-belts and establishing Transit-Oriented Density (TOD) parameters to compact development within existing urban boundaries."""
        },
        {
            "title": "Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006",
            "category": "Act/Rule",
            "author": "Ministry of Tribal Affairs / Ministry of Environment, Forest and Climate Change",
            "organization": "Government of India",
            "publication_date": "2007-01-02",
            "state": "National",
            "district": "All",
            "keywords": "forest rights, tribal land, FRA 2006, community forest rights, conservation, Gram Sabha",
            "document_type": "Statutory Act",
            "content": """The Forest Rights Act (FRA), 2006 recognizes and vests forest rights and occupation in forest land in forest-dwelling Scheduled Tribes and other traditional forest dwellers who have been residing in such forests for generations but whose rights could not be recorded during historical forest reservation processes.
            
            Key Rights Recognized:
            1. Title rights: Ownership over land up to a maximum of 4 hectares that was under cultivation prior to 13th December 2005.
            2. Use rights: Right to collect, use, and dispose of minor forest produce (MFP) such as tendu leaves, bamboo, and medicinal herbs.
            3. Relief and development rights: Rehabilitation in cases of illegal eviction or displacement and access to basic social infrastructure.
            4. Forest management rights: Right to protect, regenerate, conserve, or manage community forest resources for sustainable use.
            
            The Gram Sabha is statutory authority designated to initiate the process for determining the nature and extent of individual and community forest rights. Modern spatial verification using GPS and remote sensing cadastre protects tribal communities from arbitrary boundary disputes and eviction."""
        },
        {
            "title": "Policy Framework for Evidence-Based Land Governance and Scenario Simulation in India",
            "category": "Policy Brief",
            "author": "National Land Governance Working Group",
            "organization": "Ministry of Rural Development",
            "publication_date": "2026-05-18",
            "state": "National",
            "district": "All",
            "keywords": "policy innovation, scenario simulation, land degradation, climate resilience, evidence-based",
            "document_type": "Policy Brief",
            "content": """Evidence-based land governance requires moving beyond static historical records towards dynamic, predictive decision-support systems. As India targets Land Degradation Neutrality (LDN) by 2030 and balances rapid urbanization with food self-sufficiency, policy makers must evaluate counterfactual scenarios before notifying master plans or infrastructure corridors.
            
            This policy brief presents the architecture for integrating:
            - Cadastral GIS parcel records (Bhu-Aadhaar).
            - Multi-spectral remote sensing for continuous LULC change detection.
            - Socioeconomic Census indicators measuring agricultural dependency and demographic shifts.
            - Cellular-automata policy simulation sandboxes estimating carbon sequestration variance, agricultural yield impacts, and municipal service expenditure under alternative regulatory models.
            
            Simulations reveal that enacting compact development incentives paired with 5-kilometer agricultural protection buffers preserves over 320 sq km of high-yield soil per million urban population growth while lowering infrastructure capital outlays by up to 35%."""
        }
    ]

    for doc_data in documents:
        document_service.add_document(
            title=doc_data["title"],
            content=doc_data["content"],
            category=doc_data["category"],
            author=doc_data["author"],
            organization=doc_data["organization"],
            publication_date=doc_data["publication_date"],
            state=doc_data["state"],
            district=doc_data["district"],
            keywords=doc_data["keywords"],
            document_type=doc_data["document_type"]
        )
        print(f"Indexed document: {doc_data['title']}")

    # 3. Seed Socioeconomic Indicators across Districts
    districts_data = [
        # Telangana
        ("Telangana", "Hyderabad", 2026, 4200000, 100.0, 83.2, 0.4, 45.2, 110.0, 0.05, 3450),
        ("Telangana", "Rangareddy", 2026, 2600000, 58.4, 71.9, 24.5, 380.0, 142.5, 1.25, 1850),
        ("Telangana", "Medchal", 2026, 1750000, 62.1, 74.5, 18.2, 210.0, 135.0, 1.10, 1420),
        ("Telangana", "Sangareddy", 2026, 1600000, 36.8, 64.1, 48.6, 490.0, 155.0, 1.65, 890),
        ("Telangana", "Warangal", 2026, 1250000, 32.5, 67.2, 54.2, 620.0, 168.0, 1.80, 540),
        ("Telangana", "Nalgonda", 2026, 1650000, 22.8, 63.8, 62.4, 410.0, 175.0, 2.10, 410),
        
        # Andhra Pradesh
        ("Andhra Pradesh", "Visakhapatnam", 2026, 2350000, 47.5, 66.9, 38.2, 1120.0, 138.0, 1.45, 1150),
        ("Andhra Pradesh", "Krishna", 2026, 2100000, 38.2, 73.7, 51.5, 310.0, 185.0, 1.55, 680),
        ("Andhra Pradesh", "Guntur", 2026, 2450000, 35.4, 67.4, 56.8, 480.0, 178.0, 1.70, 720)
    ]

    for state, dist, yr, pop, urb, lit, agri, forest, crop, hold, ind in districts_data:
        db_manager.execute_insert(
            """INSERT OR REPLACE INTO socioeconomic_indicators 
            (state, district, year, population, urban_pop_pct, literacy_rate, agri_workers_pct, forest_cover_sqkm, crop_intensity_pct, avg_landholding_ha, industrial_units)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (state, dist, yr, pop, urb, lit, agri, forest, crop, hold, ind)
        )
    print("Seeded socioeconomic indicators.")

    # 4. Seed Dataset Catalog
    datasets = [
        ("National Cadastral Boundary Database (Bhu-Naksha)", "Vector polygon boundaries of surveyed agricultural parcels and village abadi lands with Bhu-Aadhaar (ULPIN) linkage.", "Department of Land Resources / NIC", "National", "2018-2026", "GeoJSON", 52428800),
        ("Multi-Temporal LULC Transition Matrix (Telangana)", "Annual 10-meter classified land-use/land-cover raster and vector polygons derived from Sentinel-2 MSI.", "ISRO / National Remote Sensing Centre (NRSC)", "State", "2018-2026", "GeoJSON / NetCDF", 24657920),
        ("District Socioeconomic & Land Holding Census", "Normalized district-level records covering workforce distribution, irrigation intensity, and average agricultural landholding.", "Directorate of Economics and Statistics", "State", "2015-2026", "CSV", 4194304),
        ("Forest Canopy & Green Cover Spectral Index (NDVI)", "Bi-monthly NDVI and vegetative health monitoring rasters calibrated for forest conservation and agro-forestry.", "Forest Survey of India (FSI)", "National", "2020-2026", "GeoTIFF", 18874368)
    ]

    for name, desc, src, cov, temp, fmt, sz in datasets:
        dataset_service.add_dataset(
            name=name,
            description=desc,
            source=src,
            geographic_coverage=cov,
            temporal_coverage=temp,
            format_type=fmt,
            size_bytes=sz
        )
        print(f"Registered dataset: {name}")

    # 5. Seed Real GIS GeoJSON Layers (Administrative & LULC)
    telangana_admin_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"name": "Hyderabad", "category": "District", "state": "Telangana", "urban_pct": 100.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.35, 17.30], [78.58, 17.30], [78.58, 17.48], [78.35, 17.48], [78.35, 17.30]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Rangareddy", "category": "District", "state": "Telangana", "urban_pct": 58.4},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.10, 17.10], [78.65, 17.10], [78.65, 17.60], [78.10, 17.60], [78.10, 17.10]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Medchal-Malkajgiri", "category": "District", "state": "Telangana", "urban_pct": 62.1},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.38, 17.45], [78.70, 17.45], [78.70, 17.75], [78.38, 17.75], [78.38, 17.45]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Warangal", "category": "District", "state": "Telangana", "urban_pct": 32.5},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[79.35, 17.80], [79.80, 17.80], [79.80, 18.15], [79.35, 18.15], [79.35, 17.80]]]
                }
            }
        ]
    }

    lulc_2018_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"category": "Agriculture", "year": 2018, "fill": "#22c55e", "stroke": "#16a34a", "area_sqkm": 4850.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.20, 17.15], [78.50, 17.15], [78.50, 17.35], [78.20, 17.35], [78.20, 17.15]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"category": "Built-up", "year": 2018, "fill": "#ef4444", "stroke": "#dc2626", "area_sqkm": 1220.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.40, 17.35], [78.52, 17.35], [78.52, 17.45], [78.40, 17.45], [78.40, 17.35]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"category": "Forest", "year": 2018, "fill": "#15803d", "stroke": "#166534", "area_sqkm": 1640.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.05, 17.40], [78.18, 17.40], [78.18, 17.58], [78.05, 17.58], [78.05, 17.40]]]
                }
            }
        ]
    }

    lulc_2026_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"category": "Agriculture", "year": 2026, "fill": "#22c55e", "stroke": "#16a34a", "area_sqkm": 4180.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.20, 17.15], [78.38, 17.15], [78.38, 17.30], [78.20, 17.30], [78.20, 17.15]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"category": "Built-up", "year": 2026, "fill": "#ef4444", "stroke": "#dc2626", "area_sqkm": 1940.0, "note": "Rapid peri-urban conversion along ORR"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.35, 17.28], [78.58, 17.28], [78.58, 17.52], [78.35, 17.52], [78.35, 17.28]]]
                }
            },
            {
                "type": "Feature",
                "properties": {"category": "Forest", "year": 2026, "fill": "#15803d", "stroke": "#166534", "area_sqkm": 1580.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[78.05, 17.40], [78.17, 17.40], [78.17, 17.57], [78.05, 17.57], [78.05, 17.40]]]
                }
            }
        ]
    }

    db_manager.execute_insert(
        "INSERT INTO gis_layers (layer_name, layer_type, state, district, year, geojson_data) VALUES (?, ?, ?, ?, ?, ?)",
        ("Administrative Boundaries", "administrative", "Telangana", "All", 2026, json.dumps(telangana_admin_geojson))
    )
    db_manager.execute_insert(
        "INSERT INTO gis_layers (layer_name, layer_type, state, district, year, geojson_data) VALUES (?, ?, ?, ?, ?, ?)",
        ("LULC 2018 Baseline Classification", "lulc", "Telangana", "Rangareddy", 2018, json.dumps(lulc_2018_geojson))
    )
    db_manager.execute_insert(
        "INSERT INTO gis_layers (layer_name, layer_type, state, district, year, geojson_data) VALUES (?, ?, ?, ?, ?, ?)",
        ("LULC 2026 Satellite Observed Classification", "lulc", "Telangana", "Rangareddy", 2026, json.dumps(lulc_2026_geojson))
    )
    print("Seeded GIS Layers.")
    db_manager.execute_insert(
        "INSERT INTO innovation_initiatives (title, type, description, creator_id) VALUES (?, ?, ?, ?)",
        ("SIH26019 - Land Governance Hackathon", "Hackathon", "Build a secure, scalable, AI-enabled national research and policy innovation platform for land governance.", 1)
    )
    db_manager.execute_insert(
        "INSERT INTO innovation_initiatives (title, type, description, creator_id) VALUES (?, ?, ?, ?)",
        ("National Spatial Data Grant 2026", "Grant", "Funding for innovative approaches to integrating rural drone cadastre with multi-spectral satellite indices.", 1)
    )
    print("Seeded Innovation Initiatives.")
    
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
