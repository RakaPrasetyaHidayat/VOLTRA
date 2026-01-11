-- Add OTP columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_otp_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_otp_expires TIMESTAMP;

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
