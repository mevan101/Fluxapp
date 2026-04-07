import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import SimulatorPage from './pages/SimulatorPage'
import GalleryPage from './pages/GalleryPage'
import ClassroomPage from './pages/ClassroomPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/classroom" element={<Layout><ClassroomPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
