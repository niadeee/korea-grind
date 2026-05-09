import { supabase } from './supabaseClient'

export const supabaseStorage = {
  async get(key) {
      try {
            const { data: { user } } = await supabase.auth.getUser()
                  if (!user) return null

                        const { data, error } = await supabase
                                .from('user_data')
                                        .select('value')
                                                .eq('user_id', user.id)
                                                        .eq('key', key)
                                                                .single()

                                                                      if (error) {
                                                                              console.log('No data found, returning null')
                                                                                      return null
                                                                                            }

                                                                                                  return { value: data.value }
                                                                                                      } catch (e) {
                                                                                                            console.error('Storage get error:', e)
                                                                                                                  return null
                                                                                                                      }
                                                                                                                        },
                                                                                                                        
                                                                                                                          async set(key, value) {
                                                                                                                              try {
                                                                                                                                    const { data: { user } } = await supabase.auth.getUser()
                                                                                                                                          if (!user) throw new Error('No user session')
                                                                                                                                          
                                                                                                                                                const { error } = await supabase
                                                                                                                                                        .from('user_data')
                                                                                                                                                                .upsert({
                                                                                                                                                                          user_id: user.id,
                                                                                                                                                                                    key,
                                                                                                                                                                                              value,
                                                                                                                                                                                                        updated_at: new Date().toISOString(),
                                                                                                                                                                                                                }, {
                                                                                                                                                                                                                          onConflict: 'user_id,key'
                                                                                                                                                                                                                                  })
                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                        if (error) throw error
                                                                                                                                                                                                                                              return { success: true }
                                                                                                                                                                                                                                                  } catch (e) {
                                                                                                                                                                                                                                                        console.error('Storage set error:', e)
                                                                                                                                                                                                                                                              throw e
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                      subscribe(key, callback) {
                                                                                                                                                                                                                                                                          supabase.auth.getUser().then(({ data: { user } }) => {
                                                                                                                                                                                                                                                                                if (!user) return
                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                      const subscription = supabase
                                                                                                                                                                                                                                                                                              .from('user_data')
                                                                                                                                                                                                                                                                                                      .on('*', (payload) => {
                                                                                                                                                                                                                                                                                                                if (payload.new.key === key && payload.new.user_id === user.id) {
                                                                                                                                                                                                                                                                                                                            callback({ value: payload.new.value })
                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                              })
                                                                                                                                                                                                                                                                                                                                                      .subscribe()
                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                            return () => subscription.unsubscribe()
                                                                                                                                                                                                                                                                                                                                                                })
                                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                                  }
