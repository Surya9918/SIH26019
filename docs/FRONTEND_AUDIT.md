# Frontend & Repository Audit

## 1. Current Architecture
The current application architecture relies on a Python FastAPI backend and a monolithic Vanilla JS frontend (Single Page Application without a framework). 
The frontend is primarily composed of:
- `frontend/templates/index.html` (500+ lines, contains all the HTML markup for 12 tabs)
- `frontend/static/css/portal.css`
- `frontend/static/js/portal.js`

The FastAPI server mounts the static directory to `/static` and manually serves `index.html` on the root route. 

## 2. Existing Pages & Components
The current UI is structured as a series of hidden/shown tabs:
1. **Overview**: Basic 4-card metric dashboard and static architecture description.
2. **Research Repository**: Document listing with basic search/filters.
3. **AI Evidence Assistant (RAG)**: Chat interface for asking grounded policy questions.
4. **GIS Geospatial Studio**: Basic vector map (SVG based) with layer toggling and LULC matrix.
5. **Policy Innovation Lab**: Form with range sliders for urban growth, buffer zones, and TOD density.
6. **Socioeconomic Analytics**: Static tables and text summaries of correlation matrices.
7. **Data Catalog**: Simple table of dataset names and hashes.
8. **Cryptographic Provenance**: Table showing SHA-256 blocks and ledger verification.
9. **Policy Briefings**: Button to generate a report, outputs plain text.
10. **SIH Demo Workflow**: A sequence of buttons to mock the judge walkthrough.
11. **Admin & Audits**: Basic table for audit logs.
12. **Login Switch**: Very basic username/password form for role switching.

## 3. Existing APIs
The backend has 13 routers defined in `backend/api`:
- `auth_routes.py` (Authentication & RBAC)
- `document_routes.py` (Research documents)
- `dataset_routes.py` (Data catalog)
- `search_routes.py` (Hybrid search)
- `rag_routes.py` (Grounded AI assistant)
- `gis_routes.py` (Spatial features and LULC)
- `analytics_routes.py` (Socioeconomic data)
- `scenario_routes.py` (Policy simulation)
- `workspace_routes.py`
- `provenance_routes.py` (Merkle ledger)
- `report_routes.py` (Policy briefing generation)
- `admin_routes.py` (Audit logs)
- `ai_routes.py`

## 4. UI/UX Problems Identified
- **Cramped Header & Navigation**: The current navigation bar overflows horizontally on smaller screens, forcing users to scroll.
- **Monolithic HTML**: All tabs are crammed into one single `index.html` file, leading to maintainability issues and bloated DOM.
- **Generic Aesthetic**: The design lacks the "National Platform" feel, relying on basic tables and buttons instead of a premium intelligence product feel.
- **Lack of Microinteractions**: Very little feedback is given to the user during loading or state changes.
- **Poor Geographic Visualization**: The GIS studio is an SVG canvas, which is very primitive for a spatial platform. It needs a real mapping library (like Leaflet or Mapbox).
- **Fake/Placeholder Data**: Many elements like socioeconomic analytics are hardcoded strings in HTML instead of dynamic visualizations.
- **Accessibility**: Missing ARIA labels, focus management, semantic structure for tables/forms.
- **Missing Global Command Center**: No unified search or quick navigation paradigm.

## 5. Recommended Redesign & Action Plan
- **Frontend Framework**: Rebuild the frontend using React (Vite) with a robust component architecture (`components/layout`, `components/gis`, `components/ai`, etc.).
- **Design System**: Implement a custom design system focusing on "Government-grade trust", using tokens for colors, typography, spacing, and shadows (e.g., using Tailwind CSS to speed up development while keeping it custom, or structured SCSS/Vanilla CSS modules).
- **Routing**: Introduce a real client-side router (React Router) to handle views instead of toggling `div` visibility.
- **GIS Upgrade**: Replace SVG maps with an interactive map using `react-leaflet` or `mapbox-gl`.
- **Command Center**: Implement a `Cmd+K` global command palette for quick navigation and global search.
- **UX Polish**: Add proper loading states, skeletons, toast notifications, and interactive micro-animations using Framer Motion.
- **API Integration**: Hook up all React components to the existing robust FastAPI endpoints, ensuring no hardcoded dummy data is displayed unless labeled "Demo".
- **Backend Serving**: Adjust `main.py` in FastAPI to correctly serve the Vite build output (`dist` folder).
