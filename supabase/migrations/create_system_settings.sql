-- Create is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_secret BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (Only admins can access)
CREATE POLICY "Admins can view system settings"
    ON system_settings
    FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update system settings"
    ON system_settings
    FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can insert system settings"
    ON system_settings
    FOR INSERT
    WITH CHECK (public.is_admin());

-- Insert default SMTP settings (disabled by default)
INSERT INTO system_settings (key, value, description, is_secret)
VALUES 
    (
        'smtp_config', 
        '{"enable_emails": false, "smtp_host": "", "smtp_port": 587, "smtp_user": "", "smtp_pass": ""}'::jsonb, 
        'Configuration for outgoing emails (SMTP)', 
        true
    )
ON CONFLICT (key) DO NOTHING;
