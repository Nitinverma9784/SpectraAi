-- Add explicit business constraint fields to the decision engine schema
ALTER TABLE decisions 
ADD COLUMN IF NOT EXISTS cost_constraint text,
ADD COLUMN IF NOT EXISTS time_constraint text,
ADD COLUMN IF NOT EXISTS scalability_requirement text,
ADD COLUMN IF NOT EXISTS risk_tolerance text;
