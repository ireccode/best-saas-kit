-- Function to safely deduct credits
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id UUID,
  p_amount INTEGER
) RETURNS json AS $$
DECLARE
  v_credits json;
BEGIN
  -- Update credits and return the updated record
  UPDATE user_credits
  SET 
    credits = credits - p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  AND credits >= p_amount
  RETURNING json_build_object(
    'id', id,
    'user_id', user_id,
    'credits', credits,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_credits;

  -- Check if update was successful
  IF v_credits IS NULL THEN
    RAISE EXCEPTION 'insufficient_credits';
  END IF;

  RETURN v_credits;
END;
$$ LANGUAGE plpgsql;
