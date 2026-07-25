-- Create contacts_info table
CREATE TABLE IF NOT EXISTS contacts_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('header', 'card')),
  title TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE contacts_info ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read contacts_info" ON contacts_info FOR SELECT USING (true);
CREATE POLICY "Auth insert contacts_info" ON contacts_info FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update contacts_info" ON contacts_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete contacts_info" ON contacts_info FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default header if not exists
INSERT INTO contacts_info (type, title, sort_order)
SELECT 'header', 'VIA DELLA SPIGA 34, 20121 MILANO', 0
WHERE NOT EXISTS (SELECT 1 FROM contacts_info WHERE type = 'header');

-- Insert some default cards if empty
INSERT INTO contacts_info (type, title, address, email, phone, sort_order)
SELECT 'card', 'SHOWROOM', 'Via della Spiga 34, 20121 Milano', 'showroom@sethes.com', '+39 02 1234567', 1
WHERE NOT EXISTS (SELECT 1 FROM contacts_info WHERE type = 'card');
