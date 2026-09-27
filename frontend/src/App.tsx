import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Overview } from './pages/Overview'
import { Research } from './pages/Research'
import { AiEvidence } from './pages/AiEvidence'
import { GisStudio } from './pages/GisStudio'
import { PolicyLab } from './pages/PolicyLab'
import { Analytics } from './pages/Analytics'
import { DataCatalog } from './pages/DataCatalog'
import { InnovationPortal } from './pages/InnovationPortal'
import { Provenance } from './pages/Provenance'
import { Reports } from './pages/Reports'
import { Admin } from './pages/Admin'
import { AuditLogs } from './pages/AuditLogs'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="research/*" element={<Research />} />
        <Route path="ai" element={<AiEvidence />} />
        <Route path="gis" element={<GisStudio />} />
        <Route path="policy" element={<PolicyLab />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="data" element={<DataCatalog />} />
        <Route path="innovation" element={<InnovationPortal />} />
        <Route path="governance/provenance" element={<Provenance />} />
        <Route path="governance/audit" element={<AuditLogs />} />
        <Route path="reports" element={<Reports />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
