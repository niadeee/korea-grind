# How to Edit Korea Grind

## Making Changes

1. **Edit the main app code** → `/src/KoreaGrind.jsx`
2.    - This is where all the habit tracking logic, UI, and features live
      -    - Changes here immediately update the app
       
           - 2. **Edit styling** → `/src/index.css`
             3.    - Global styles, Tailwind directives, and custom CSS
                   -    - Works with Tailwind utilities in JSX components
                    
                        - 3. **Edit environment variables** → `.env.local` (create in your local machine)
                          4.    - Copy values from `.env.example`
                                -    - Add your actual Supabase URL and anonymous key
                                     -    - This file is NOT committed to GitHub (listed in `.gitignore`)
                                      
                                          - ## Deploying After Changes
                                      
                                          - 1. Make your edits locally
                                            2. 2. Commit and push to GitHub:
                                               3.    ```
                                                        git add .
                                                        git commit -m "Your change description"
                                                        git push origin main
                                                        ```
                                                     3. **Vercel auto-deploys** → Your changes go live in ~30 seconds
                                                 
                                                     4. ## What Each File Does
                                                 
                                                     5. - **src/App.jsx** → Authentication wrapper, handles Google login
                                                        - - **src/KoreaGrind.jsx** → Main app, all features and UI
                                                          - - **src/supabaseClient.js** → Supabase connection setup
                                                            - - **src/supabaseStorage.js** → Real-time data sync between devices
                                                              - - **src/index.css** → Styling and fonts
                                                                - - **package.json** → Project dependencies
                                                                  - - **vite.config.js** → Build configuration
                                                                    - - **.gitignore** → Files to exclude from GitHub
                                                                      - - **.env.example** → Template for environment variables
                                                                       
                                                                        - ## Troubleshooting
                                                                       
                                                                        - If your changes don't show up:
                                                                        - - Check Vercel deployment status in your dashboard
                                                                          - - Refresh your browser (Ctrl+F5 or Cmd+Shift+R to bypass cache)
                                                                            - - Verify `.env.local` has the correct Supabase credentials
                                                                             
                                                                              - ## Adding New Features
                                                                             
                                                                              - 1. Update `KoreaGrind.jsx` with your new code
                                                                                2. 2. If you need new data fields, update the `supabaseStorage` keys
                                                                                   3. 3. Add UI to the appropriate tab component
                                                                                      4. 4. Test locally, then commit and push
                                                                                        
                                                                                         5. That's it! The real-time sync works automatically via Supabase subscriptions.
