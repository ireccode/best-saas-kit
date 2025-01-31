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
