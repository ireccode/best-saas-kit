import { SupabaseClient } from '@supabase/supabase-js'

export interface UserCredits {
  id: number
  user_id: string
  credits: number
  created_at: string
  updated_at: string
}

export async function verifyCredits(
  supabase: SupabaseClient,
  userId: string,
  requiredCredits: number = 1
): Promise<UserCredits> {
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    throw error
  }

  if (!data || data.credits < requiredCredits) {
    throw new Error('Insufficient credits')
  }

  return data as UserCredits
}

export async function deductCredits(
  supabase: SupabaseClient,
  userId: string,
  amount: number = 1
): Promise<UserCredits> {
  // Use a PostgreSQL function to safely deduct credits
  const { data, error } = await supabase
    .rpc('deduct_user_credits', {
      p_user_id: userId,
      p_amount: amount
    })
    .single()

  if (error) {
    throw error
  }

  return data as UserCredits
}
