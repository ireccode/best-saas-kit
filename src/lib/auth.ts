import { NextAuthOptions } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import CredentialsProvider from 'next-auth/providers/credentials';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug logs
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          // Sign in with Supabase Auth
          const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (signInError || !user) {
            console.error('Supabase auth error:', signInError);
            throw new Error(signInError?.message || 'Invalid credentials');
          }

          // Get additional user data from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, credits, web_ui_enabled, role')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            throw new Error('Failed to fetch user data');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'User',
            credits: userData?.credits || 0,
            webUIEnabled: userData?.web_ui_enabled || false,
            roles: [userData?.role || 'user'],
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.credits = (user as any).credits;
        token.webUIEnabled = (user as any).webUIEnabled;
        token.roles = (user as any).roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        (session.user as any).credits = token.credits;
        (session.user as any).webUIEnabled = token.webUIEnabled;
        (session.user as any).roles = token.roles;
      }
      return session;
    },
  },
};
