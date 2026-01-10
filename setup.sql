-- SQL for Voltra Database Setup with RLS and Complete Columns
-- Execute this on your NeonDB Console

-- 1. Tables Creation
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT, -- Kolom untuk menyimpan hashed password
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    verification_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    UNIQUE (provider, provider_user_id)
);

CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    invite_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS server_members (
    server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    PRIMARY KEY (server_id, user_id)
);

CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack TEXT,
    background TEXT,
    problem_to_solve TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_channels (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    sub_channel_id INTEGER REFERENCES sub_channels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    details TEXT,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- To make API work, we use a session variable 'app.current_user_id'

-- Users Policy: Can see own profile
CREATE POLICY users_policy ON users
    FOR ALL
    USING (id = current_setting('app.current_user_id', true)::integer);

-- Servers Policy: Can see servers where they are members
CREATE POLICY servers_policy ON servers
    FOR ALL
    USING (
        id IN (SELECT server_id FROM server_members WHERE user_id = current_setting('app.current_user_id', true)::integer)
        OR owner_id = current_setting('app.current_user_id', true)::integer
    );

-- Server Members Policy
CREATE POLICY server_members_policy ON server_members
    FOR ALL
    USING (
        server_id IN (SELECT id FROM servers WHERE owner_id = current_setting('app.current_user_id', true)::integer)
        OR user_id = current_setting('app.current_user_id', true)::integer
    );

-- Channels Policy
CREATE POLICY channels_policy ON channels
    FOR ALL
    USING (
        server_id IN (SELECT server_id FROM server_members WHERE user_id = current_setting('app.current_user_id', true)::integer)
    );

-- SubChannels Policy
CREATE POLICY sub_channels_policy ON sub_channels
    FOR ALL
    USING (
        channel_id IN (
            SELECT c.id FROM channels c 
            JOIN server_members sm ON c.server_id = sm.server_id 
            WHERE sm.user_id = current_setting('app.current_user_id', true)::integer
        )
    );

-- Tasks Policy
CREATE POLICY tasks_policy ON tasks
    FOR ALL
    USING (
        sub_channel_id IN (
            SELECT sc.id FROM sub_channels sc
            JOIN channels c ON sc.channel_id = c.id
            JOIN server_members sm ON c.server_id = sm.server_id
            WHERE sm.user_id = current_setting('app.current_user_id', true)::integer
        )
    );
