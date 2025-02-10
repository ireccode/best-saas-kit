# Scratchpad

## Lessons

### Authentication Flow
1. When using Supabase with Next.js, always use `createMiddlewareClient` in middleware for proper session handling
2. Keep the user data in separate tables (`users` and `user_credits`) for better organization
3. Use realtime subscriptions for live updates of user data
4. Important component patterns:
   - Header.tsx needs 'use client' directive
   - Use proper Database type with createClientComponentClient: `createClientComponentClient<Database>()`
   - Handle credits separately from user profile for better performance

### Fixed Issues
1. Login Session Issue:
   - Root cause: Middleware was not properly handling Supabase sessions
   - Solution: 
     - Use createMiddlewareClient for session handling
     - Keep original working code structure that separates auth and login routes
     - Maintain proper route protection with isPublicPage checks

2. User Data Management:
   - Keep user profile and credits in separate tables
   - Use realtime subscriptions for live updates
   - Handle "not found" errors gracefully (e.g., `creditsError.code !== 'PGRST116'`)

### Current Task Status
[X] Fix login session issues
[X] Implement proper session handling
[X] Fix dashboard access
[X] Implement secure authentication workflow

### Next Steps
[ ] Implement proper error handling for edge cases
[ ] Add loading states for better UX
[ ] Implement proper TypeScript types for all components
[ ] Add proper testing for authentication flow
