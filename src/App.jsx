import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Editor from './pages/Editor/Editor.jsx'
import Preview from './pages/Preview/Preview.jsx'
import Letterbox from './pages/Letterbox/Letterbox.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import PublicView from './pages/PublicView/PublicView.jsx'
import RequireAuth from './components/layout/RequireAuth.jsx'
import { useAuthStore } from './store/authStore.js'
import { useLettersStore } from './store/lettersStore.js'

export default function App() {
  const user = useAuthStore((s) => s.user)
  const fetchLetters = useLettersStore((s) => s.fetchLetters)
  const reset = useLettersStore((s) => s.reset)

  useEffect(() => {
    if (user) {
      fetchLetters()
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/view/:letterId" element={<PublicView />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/editor"
        element={
          <RequireAuth>
            <Editor />
          </RequireAuth>
        }
      />
      <Route
        path="/editor/:letterId"
        element={
          <RequireAuth>
            <Editor />
          </RequireAuth>
        }
      />
      <Route
        path="/preview/:letterId"
        element={
          <RequireAuth>
            <Preview />
          </RequireAuth>
        }
      />
      <Route
        path="/letters"
        element={
          <RequireAuth>
            <Letterbox />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
