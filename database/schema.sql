-- database/schema.sql
-- Enhanced schema with indexes, constraints, and security

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE budget_method AS ENUM ('50_30_20', 'zero_based', '70_20_10', '60_percent');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'paused', 'cancelled');

-- Users table (managed by Supabase Auth)
-- We'll reference auth.users

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    description TEXT,
    transaction_type transaction_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0 AND amount <= 1000000),
    CONSTRAINT valid_description_length CHECK (char_length(description) <= 200)
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50),
    method budget_method NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (period_end > period_start),
    CONSTRAINT valid_budget_amount CHECK (amount > 0 AND amount <= 1000000)
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12, 2) DEFAULT 0 CHECK (current_amount >= 0),
    target_date DATE NOT NULL,
    status goal_status DEFAULT 'active',
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_target_amount CHECK (target_amount > 0 AND target_amount <= 10000000),
    CONSTRAINT valid_progress CHECK (current_amount <= target_amount)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    billing_cycle VARCHAR(20) NOT NULL, -- monthly, yearly, weekly
    next_billing_date DATE NOT NULL,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);
CREATE INDEX idx_transactions_recurring ON transactions(recurring_id) WHERE recurring_id IS NOT NULL;

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_active ON budgets(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_budgets_period ON budgets(user_id, period_start, period_end);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(user_id, status) WHERE status = 'active';

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date) WHERE is_active = TRUE;

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can manage their own budgets"
    ON budgets FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals"
    ON goals FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subscriptions"
    ON subscriptions FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI conversations"
    ON ai_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI conversations"
    ON ai_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_user_transaction_summary(p_user_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    total_income DECIMAL,
    total_expenses DECIMAL,
    net_balance DECIMAL,
    transaction_count BIGINT,
    average_transaction DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE -amount END), 0) as net_balance,
        COUNT(*) as transaction_count,
        COALESCE(AVG(amount), 0) as average_transaction
    FROM transactions
    WHERE user_id = p_user_id
        AND date >= p_start_date
        AND date <= p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for budget tracking
CREATE OR REPLACE VIEW budget_tracking AS
SELECT 
    b.id,
    b.user_id,
    b.name,
    b.amount as budget_amount,
    b.category,
    b.period_start,
    b.period_end,
    COALESCE(SUM(t.amount), 0) as spent_amount,
    b.amount - COALESCE(SUM(t.amount), 0) as remaining_amount,
    CASE 
        WHEN b.amount > 0 THEN (COALESCE(SUM(t.amount), 0) / b.amount * 100)
        ELSE 0 
    END as percentage_used
FROM budgets b
LEFT JOIN transactions t ON 
    t.user_id = b.user_id 
    AND t.transaction_type = 'expense'
    AND (b.category IS NULL OR t.category = b.category)
    AND t.date >= b.period_start 
    AND t.date <= b.period_end
WHERE b.is_active = TRUE
GROUP BY b.id, b.user_id, b.name, b.amount, b.category, b.period_start, b.period_end;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;