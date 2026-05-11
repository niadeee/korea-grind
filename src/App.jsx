import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import KoreaGrind from './korea-grind'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  // List of allowed email addresses - add your email(s) here
  const ALLOWED_EMAILS = [
    import.meta.env.VITE_ALLOWED_EMAIL_1,
    import.meta.env.VITE_ALLOWED_EMAIL_2
  ].filter(Boolean)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user?.email) {
        const isAuthorized = ALLOWED_EMAILS.includes(session.user.email)
        setAuthorized(isAuthorized)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user?.email) {
        const isAuthorized = ALLOWED_EMAILS.includes(session.user.email)
        setAuthorized(isAuthorized)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black font-mono text-xs tracking-widest">LOADING</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Archivo Black'" }}>
            Korea Grind
          </h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={['google']}
            onlyThirdPartyProviders={false}
          />
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">
            This account ({session.user.email}) does not have access to Korea Grind.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return <KoreaGrind user={session.user} />
}
