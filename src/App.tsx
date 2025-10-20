import "./App.css"

import { Navigate, Route, Routes } from "react-router-dom"

import Layout from "@/layouts/Layout"
import { useAuth } from "@/lib/auth"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import LogBookPage from "@/pages/LogBookPage"
import TopicCloudPage from "@/pages/TopicCloudPage"

const App = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/logbook" replace />} />
        <Route path="/logbook" element={<LogBookPage />} />
        <Route path="/topic-cloud" element={<TopicCloudPage />} />
        <Route path="*" element={<Navigate to="/logbook" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
