/*
  # Create overlays table for RTSP livestream overlay management

  1. New Tables
    - `overlays`
      - `id` (uuid, primary key) - Unique identifier for each overlay
      - `type` (text) - Type of overlay: 'text' or 'image'
      - `content` (text) - Text content or image URL
      - `position` (jsonb) - Position object with x and y coordinates
      - `size` (jsonb) - Size object with width and height
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `overlays` table
    - Add policy for public read access (for livestream viewers)
    - Add policy for public write access (for overlay management)
    
  Note: This is a demo application, so we're using permissive policies.
  In production, you would want to add proper authentication and authorization.
*/

CREATE TABLE IF NOT EXISTS overlays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('text', 'image')),
  content text NOT NULL,
  position jsonb NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
  size jsonb NOT NULL DEFAULT '{"width": 200, "height": 100}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE overlays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to overlays"
  ON overlays
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to overlays"
  ON overlays
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to overlays"
  ON overlays
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to overlays"
  ON overlays
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS overlays_type_idx ON overlays(type);
CREATE INDEX IF NOT EXISTS overlays_created_at_idx ON overlays(created_at DESC);