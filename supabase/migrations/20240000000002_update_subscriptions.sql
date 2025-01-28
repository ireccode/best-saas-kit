-- Add missing columns to customer_subscriptions table
ALTER TABLE customer_subscriptions
  ADD COLUMN IF NOT EXISTS price_id text,
  ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS cancel_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS ended_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS trial_start timestamp with time zone,
  ADD COLUMN IF NOT EXISTS trial_end timestamp with time zone;

-- Drop the plan_id constraint as we're using price_id directly
ALTER TABLE customer_subscriptions DROP CONSTRAINT IF EXISTS customer_subscriptions_plan_id_fkey;
ALTER TABLE customer_subscriptions ALTER COLUMN plan_id DROP NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_user_id ON customer_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_subscription_id ON customer_subscriptions(subscription_id);
