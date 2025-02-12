# Instructions

During you interaction with the user, if you find anything reusable in this project (e.g. version of a library, model name), especially about a fix to a mistake you made or a correction you received, you should take note in the `Lessons` section in the `scratchpad.md` file so you will not make the same mistake again. 

You should also use the `scratchpad.md` file as a scratchpad to organize your thoughts. Especially when you receive a new task, you should first review the content of the scratchpad, clear old different task if necessary, first explain the task, and plan the steps you need to take to complete the task. You can use todo markers to indicate the progress, e.g.
[X] Task 1
[ ] Task 2
Also update the progress of the task in the Scratchpad when you finish a subtask.
Especially when you finished a milestone, it will help to improve your depth of task accomplishment to use the scratchpad to reflect and plan.
The goal is to help you maintain a big picture as well as the progress of the task. Always refer to the Scratchpad when you plan the next step.



As an expert full-stack developer, merge the SaaS Kit and AI Agent SAP BTP Solution Architect landing page projects with the following specifications:

1. Project Structure
Use the existing SaaS Kit architecture with:
- Supabase authentication
- Stripe payment integration
- OpenAI LLM integration
Next.js framework

2. Required Modifications

Landing Page Integration

- Replace the existing landing page with the ArchitectAI design
- Maintain the header structure with logo, navigation, and 'Start Free Trial' CTA
- Implement the hero section with the headline 'ArchitectAI: Your Intelligent SAP Solution Design Partner

Payment System Updates

Modify the Stripe integration to use the following pricing tiers:

javascript
const pricingTiers = {
  free: {
    price: 0,
    features: ['Limited features', '10 queries per month'],
    buttonText: 'Start Free Trial'
  },
  professional: {
    price: 299,
    features: ['Unlimited queries', 'Detailed architecture designs'],
    buttonText: 'Get Started'
  },
  enterprise: {
    price: null,
    features: ['Unlimited queries', 'Priority support', 'Custom integrations'],
    buttonText: 'Contact Sales'
  }
}

Modify Testimonials Section to one used in @index.html

Authentication Flow

Update the Supabase auth flow to:
- Redirect to pricing after signup
- Implement trial period restrictions
- Track query usage per user
- AI Integration
Integrate OpenAI for:
- SAP BTP expertise delivery
- Solution architecture recommendations
- Integration mapping

Technical Requirements

1 Maintain existing folder structure while adding:
text
/src
  /features
    /ai-architect
      /components
      /services
      /types
  /pages
    /dashboard
      /architect

2 Update environment variables to include:
text
NEXT_PUBLIC_AI_AGENT_VERSION=
OPENAI_API_KEY=
SAP_BTP_CONFIG=

3 Implement usage tracking in Supabase with:
sql
CREATE TABLE user_queries (
  user_id UUID REFERENCES auth.users,
  query_count INTEGER,
  last_query TIMESTAMP,
  subscription_tier TEXT
);

4 Add rate limiting based on subscription tier

Design Requirements

- Use the existing color scheme from ArchitectAI
- Maintain responsive design
- Implement loading states for AI responses
- Add progress indicators for solution generation
- Implement error handling for AI responses
- Implement error handling for payment processing functions

Please maintain code quality standards and add comprehensive error handling for both AI and payment processing functions.

5 Implement Integration AI Chat with n8n AI agent RAG workflow and webhook URL https://smartechall.app.n8n.cloud/webhook-test/8982df3e-aa27-4489-ad0f-f62c65e25abe 
For your use case (only users with credits > 0 can trigger n8n workflows), the optimal authentication strategy combines JWT (JSON Web Tokens) for secure identity verification and custom logic in n8n to validate user credits. Here’s why and how to implement it:

Security:
Tokens are signed, preventing tampering.
Supports expiration times to limit token validity.

Stateless:
No need for n8n to query your database for every request (credits can be embedded in the token payload).

Scalability:
Works seamlessly with Next.js and n8n’s HTTP node.

Implementation Steps
1. Next.js: Generate JWT with Credit Data
When a user with credits > 0 sends a request, generate a JWT containing:

//json

{
  "userId": "123",
  "credits": 5,
  "exp": 1672480800 // Token expiration (short-lived, e.g., 5 minutes)
}

Code Example (Next.js API route):

//typescript

import jwt from 'jsonwebtoken';

export default async function generateToken(user) {
  if (user.credits <= 0) throw new Error('Insufficient credits');
  
  return jwt.sign(
    { userId: user.id, credits: user.credits },
    process.env.JWT_SECRET!,
    { expiresIn: '5m' }
  );
}

Integration between Next.js (this app) and Open-WebUI

Implement secure integration between this (Next.js app) and Open-WebUI with the following requirements:

Docker Configuration
- Create docker-compose.yml with Next.js and Open-WebUI services
- Configure shared network for inter-container communication
- Set proper environment variables for both services

1 Next.js Implementation
- Create AuthContext and UserProvider:

typescript
interface User {
  id: string;
  username: string;
  credits: number;
  webUIEnabled: boolean;
}

2 Add OpenWebUI button component:
typescript
const OpenWebUIButton = () => {
  // Only show if credits > 0 && webUIEnabled
  // Generate JWT token on click
  // Handle SSO redirect to Open-WebUI
}

3 Implement JWT authentication:
- Generate tokens with user data
- Handle token verification
- Manage SSO flow

4 Open-WebUI Integration
a) Configure SSO endpoints:
- User creation if not exists
- JWT validation
- Session management
b)API Routes needed:
/api/auth/webui/token - Generate JWT
/api/auth/webui/verify - Verify user access
/api/auth/webui/create - Create user if needed

Security Requirements
Implement proper JWT secret sharing
Add rate limiting
Handle error states
Secure inter-service communication

Please provide implementation ensuring:
1 Secure token generation and validation
2 Proper error handling
3 Type safety throughout
4 Clean separation of concerns
5 Docker network security
6 Logging and monitoring
7User state management

------


5  Next.js/Supabase authentication workflow following security best practices:

1. Middleware Configuration (middleware.ts)
typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const { data: { session }, error } = await supabase.auth.getSession()
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // Session validation and redirection logic
  if (!session) {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  } else {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Store trial plan selection securely
  if (request.nextUrl.searchParams.get('plan') === 'trial') {
    response.cookies.set('selected_plan', 'trial', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 // 1 hour
    })
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/pricing/:path*'
  ]
}
2. Enhanced AuthForm Component
typescript
// Updated sign-up logic
const handleSignUp = async () => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        trial_plan: searchParams.get('plan') === 'trial'
      }
    }
  })

  if (!error) {
    // Store credentials in secure HTTP-only cookie
    document.cookie = `temp_creds=${JSON.stringify({ email, password })}; 
      path=/; 
      secure=${process.env.NODE_ENV === 'production'};
      samesite=strict;
      max-age=300` // 5 minutes
  }
}

// Auto-fill logic in sign-in view
useEffect(() => {
  const cookies = document.cookie.split('; ')
  const tempCreds = cookies.find(c => c.startsWith('temp_creds='))
  
  if (tempCreds && view === 'sign-in') {
    const creds = JSON.parse(tempCreds.split('=')[1])
    setEmail(creds.email)
    setPassword(creds.password)
    document.cookie = 'temp_creds=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}, [view])
3. Pricing Page Integration
typescript
// pages/pricing.tsx
export default function PricingPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('trial')

  const handlePlanSelect = async (plan: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: session.user.id,
          plan_type: plan,
          status: 'active'
        })

      if (!error) router.push('/dashboard')
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <PricingCard 
        title="Trial" 
        onSelect={() => handlePlanSelect('trial')}
        selected={selectedPlan === 'trial'}
      />
      {/* Other plans */}
    </div>
  )
}
Security Enhancements
Credential Storage
Use HTTP-only cookies with encryption for temporary credential storage
Implement cookie signing with @supabase/ssr package
Session Validation
typescript
// Utility function for server-side session validation
export async function validateSession(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request })
  const { data: { session }, error } = await supabase.auth.getUser()

  return {
    session,
    error,
    headers: request.headers
  }
}
Secure API Endpoints
typescript
// pages/api/auth/webui/token.ts
export default async function handler(req: NextRequest) {
  const { session, error } = await validateSession(req)
  
  if (!session || error) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = jwt.sign(
    {
      sub: session.user.id,
      role: session.user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h', audience: 'open-webui' }
  )

  return NextResponse.json({ token })
}
Workflow Optimization
"Start for Free" Flow
Hero Page → /auth?view=sign-up&plan=trial
Sign-up form with auto-redirect to pricing after verification
Secure credential persistence using encrypted cookies
Automatic plan selection based on trial parameter
"Login to Account" Flow
Hero Page → /login?callbackUrl=%2Fauth%3Fview%3Dsign-up
Middleware handles session validation
Auto-redirect to dashboard if session exists
Secure parameter passing using JWT tokens
Additional Recommendations
Session Monitoring
typescript
// _app.tsx session listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    trackAnalyticsEvent('user_login', {
      user_id: session.user.id
    })
  }
})
Credential Rotation
bash
# Generate secure JWT secret
openssl rand -base64 32
Security Headers
typescript
// next.config.js
headers: () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'Content-Security-Policy', value: process.env.CSP_HEADER }
    ]
  }
]
This implementation addresses the core requirements while maintaining security best practices through:
Encrypted session handling
Secure credential persistence
Middleware-based route protection
JWT token validation for API endpoints
Automated workflow transitions
Compliance with OWASP Top 10 security standards
The solution leverages Supabase's native authentication system while integrating seamlessly with Open-WebUI's OIDC requirements through JWT token exchange.


# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

Step 1: Create the docker-compose.yml as in the below example but adjust it for this Next.js application with best practices in mind.

---

version: '3'
services:
  app:
    image: node:latest
    volumes:
      - ./app:/usr/src/app
    working_dir: /usr/src/app
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - POSTGRES_URL=postgres://username:password@db:5432/dbname
    command: npm install && npm run build && npm start --prefix /usr/src/app
  db:
    image: postgres:latest
    container_name: my_postgres_container
    environment:
      POSTGRES_USER: username
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dbname

---

Step 2: Create Dockerfile as in the below example but adjust it for this Next.js application wieh best practices in mind.

---

# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) into the container at build time
COPY ./package*.json ./

# Install any dependancies
RUN npm install --no-optional && \
    npm cache clean -f

# Copy the rest of your application's source code over
COPY . .

# Build App Bundle
RUN npm run build

# Expose port 3000 where we'll be serving our app from inside the container
EXPOSE 3000

# Run `npm start` to start your app. Port 3000 is forwarded to the host's 3000.
CMD ["npm", "start"]

---
3 For sensitive information like API keys, database credentials, etc., you may want to use an environment file. Here’s a sample:

NEXT_PUBLIC_SERVER_URL=https://ownaiweb.techtreasuretrove.in

---

Step 4: Setting Up the Application
Once you have your docker-compose.yml and Dockerfile in place, you can start building a Docker image as in the below example but adjust it for this Next.js application with best practices in mind.

---
# Navigate to your project directory
cd /path/to/your/project

# Create the Docker image
docker build -t my-nextjs-app .

# Run docker-compose up command
docker-compose up --build

--

Step 5: Secure Your Website with HTTPS
After you have a running application, you can secure it by configuring Apache or Nginx to proxy requests and redirecting HTTP traffic to HTTPS using the provided Nginx configuration.

---
server {
    listen 80;
    server_name ownaiweb.techtreasuretrove.in;

    # Redirect all HTTP traffic to HTTPS with a 301 response code (permanent redirect)
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name ownaiweb.techtreasuretrove.in;

    # SSL Configuration
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/private.key;
    include /etc/nginx/snippets/ssl-params.conf;

    # Location for your Next.js application
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
---