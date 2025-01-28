-- First, drop the foreign key constraint from billing_history
ALTER TABLE billing_history
  DROP CONSTRAINT IF EXISTS billing_history_subscription_id_fkey;

-- Drop existing constraints and columns that might conflict
ALTER TABLE customer_subscriptions 
  DROP CONSTRAINT IF EXISTS customer_subscriptions_plan_id_fkey,
  DROP COLUMN IF EXISTS plan_id;

-- Drop and recreate the table to ensure clean schema
DROP TABLE IF EXISTS customer_subscriptions;

CREATE TABLE customer_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription_id text NOT NULL UNIQUE,
  price_id text NOT NULL,
  status text NOT NULL,
  quantity integer DEFAULT 1,
  current_period_start timestamp with time zone NOT NULL,
  current_period_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  ended_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_user_id ON customer_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_subscription_id ON customer_subscriptions(subscription_id);

-- Enable RLS
ALTER TABLE customer_subscriptions ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can view their own subscriptions" ON customer_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON customer_subscriptions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_customer_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_customer_subscriptions_updated_at ON customer_subscriptions;

CREATE TRIGGER update_customer_subscriptions_updated_at
  BEFORE UPDATE ON customer_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_subscriptions_updated_at();

-- Recreate the foreign key constraint for billing_history
ALTER TABLE billing_history
  ADD CONSTRAINT billing_history_subscription_id_fkey 
  FOREIGN KEY (subscription_id) 
  REFERENCES customer_subscriptions(id) 
  ON DELETE SET NULL;
