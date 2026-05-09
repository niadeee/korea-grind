import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import KoreaGrind from './korea-grind'
export default function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

  useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session)
                setLoading(false)
        })

                const {
                        data: { subscription },
                } = supabase.auth.onAuthStateChange((_event, session) => {
                        setSession(session)
                })

                return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
        return (
                <div className="min-h-screen bg-white flex items-center justify-center">
                        <div className="text-black font-mono text-xs tracking-widest">LOADING</div>div>
                </div>div>
              )
  }
  
    if (!session) {
          return (
                  <div className="min-h-screen bg-white p-4 flex items-center justify-center">
                          <div className="w-full max-w-sm">
                                    <h1 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: "'Archivo Black'" }}>
                                                Korea Grind
                                    </h1>h1>
                                    <Auth
                                                  supabaseClient={supabase}
                                                  appearance={{ theme: ThemeSupa }}
                                                  theme="light"
                                                  providers={['google']}
                                                  onlyThirdPartyProviders={false}
                                                />
                          </div>div>
                  </div>div>
                )
    }
  
    return <KoreaGrind user={session.user} />
}</div>
