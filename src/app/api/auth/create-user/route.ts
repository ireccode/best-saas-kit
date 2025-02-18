import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    // Use upsert instead of insert to handle existing users
    const { data, error } = await supabase
      .from('users')
      .upsert([userData], {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user:', error);
      // Don't treat duplicate key as an error since we're using upsert
      if (error.code === '23505') {
        // If the user already exists, fetch and return the existing user
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userData.id)
          .single();

        if (fetchError) {
          console.error('Error fetching existing user:', fetchError);
          return NextResponse.json(fetchError, { status: 500 });
        }

        return NextResponse.json(existingUser);
      }
      return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 