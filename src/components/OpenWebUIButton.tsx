'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';

export const OpenWebUIButton = () => {
  const { data: session, status } = useSession();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Uncomment after test
  // if (!user || user.credits <= 0 || !user.webUIEnabled) {
  //  return null;
  //}

  const handleOpenWebUI = async () => {
    try {
      if (!session) {
        throw new Error('Please sign in to access WebUI');
      }

      setIsLoading(true);
      setError(null);
      
      console.log('Fetching token...');
      const response = await fetch('/api/auth/webui/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      const data = await response.text();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(`Failed to get token: ${data}`);
      }

      const { token } = JSON.parse(data);
      const webUIUrl = process.env.NEXT_PUBLIC_OPENWEBUI_URL;
      
      if (!webUIUrl) {
        throw new Error('OpenWebUI URL not configured');
      }

      // Ensure webUIUrl ends with a trailing slash
      const baseUrl = webUIUrl.endsWith('/') ? webUIUrl : `${webUIUrl}/`;
      
      console.log('Redirecting to OpenWebUI...');
      // Use the api/auth/callback endpoint instead of oauth/oidc/callback
      window.location.href = `${baseUrl}api/auth/callback?token=${token}`;
    } catch (error) {
      console.error('Failed to get OpenWebUI token:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={handleOpenWebUI}
        disabled={isLoading || !session}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <svg
            className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {!session ? 'Sign in to access WebUI' : 'Open WebUI Chat'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
