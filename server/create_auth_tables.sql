-- Part 7: Authentication Tables Migration
-- Run: psql -U postgres -d portfolio_db -f create_auth_tables.sql

-- Create AdminUser table for authentication
CREATE TABLE IF NOT EXISTS "AdminUser" (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    name TEXT,
    isActive BOOLEAN NOT NULL DEFAULT true,
    lastLoginAt TIMESTAMP WITH TIME ZONE,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Session table for database-backed sessions
CREATE TABLE IF NOT EXISTS "Session" (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tokenHash TEXT NOT NULL UNIQUE,
    userId UUID NOT NULL REFERENCES "AdminUser"(id) ON DELETE CASCADE,
    expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    revokedAt TIMESTAMP WITH TIME ZONE
);

-- Create index for efficient session lookup by token hash
CREATE INDEX IF NOT EXISTS "Session_tokenHash_idx" ON "Session"(tokenHash);

-- Create index for efficient session lookup by userId
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"(userId);