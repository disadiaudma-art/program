import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import RegistrationForm from './components/RegistrationForm'
import SuccessModal from './components/SuccessModal'
import PosterModal from './components/PosterModal'
import VenueSection from './components/VenueSection'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'

function HomePage() {
  const [successData, setSuccessData] = useState(null)
  const [posterOpen, setPosterOpen] = useState(false)

  function handleSuccess(data) {
    setSuccessData(data)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmitAnother() {
    setSuccessData(null)
    document.getElementById('registrationCard')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      <HeroSection onOpenPoster={() => setPosterOpen(true)} />
      <RegistrationForm onSuccess={handleSuccess} />
      <VenueSection />
      <Footer />
      {successData && (
        <SuccessModal
          data={successData}
          onClose={() => setSuccessData(null)}
          onSubmitAnother={handleSubmitAnother}
        />
      )}
      <PosterModal open={posterOpen} onClose={() => setPosterOpen(false)} />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/go-to/admin" element={<AdminDashboard />} />
      </Routes>
    </HashRouter>
  )
}