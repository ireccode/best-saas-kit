-- Rename created_at to created in customer_subscriptions table
ALTER TABLE customer_subscriptions RENAME COLUMN created_at TO created;

-- Add any missing columns that were in the error
ALTER TABLE customer_subscriptions
  ADD COLUMN IF NOT EXISTS created timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Update the created column with existing created_at values if needed
UPDATE customer_subscriptions 
SET created = created 
WHERE created IS NULL;
