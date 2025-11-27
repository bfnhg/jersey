/*
  # Create products table for Morocco Jersey Store

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `price` (numeric) - Product price in MAD
      - `image_url` (text) - Product image URL
      - `category` (text) - Product category (Home, Away, Training, etc.)
      - `is_new` (boolean) - Whether product is new
      - `description` (text) - Product description
      - `stock` (integer) - Available stock
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (products are viewable by everyone)
    - Add policy for authenticated insert/update (for admin purposes)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Jersey',
  is_new boolean DEFAULT false,
  description text DEFAULT '',
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO products (name, price, image_url, category, is_new, description, stock) VALUES
  ('Morocco Home Jersey 2024', 899.00, 'https://images.pexels.com/photos/17829900/pexels-photo-17829900.jpeg', 'Home Kit', true, 'Official Morocco home jersey featuring the iconic red color with green accents', 50),
  ('Morocco Away Jersey 2024', 899.00, 'https://images.pexels.com/photos/8007048/pexels-photo-8007048.jpeg', 'Away Kit', true, 'Stylish white away jersey with red and green details', 45),
  ('Morocco Training Jersey', 649.00, 'https://images.pexels.com/photos/17829898/pexels-photo-17829898.jpeg', 'Training', false, 'Premium training jersey for peak performance', 60),
  ('Morocco Retro Jersey 1998', 799.00, 'https://images.pexels.com/photos/8007047/pexels-photo-8007047.jpeg', 'Retro', true, 'Celebrate Morocco heritage with this classic design', 30),
  ('Morocco Goalkeeper Jersey', 849.00, 'https://images.pexels.com/photos/17829901/pexels-photo-17829901.jpeg', 'Goalkeeper', false, 'Professional goalkeeper jersey with enhanced padding', 25),
  ('Morocco Third Kit 2024', 899.00, 'https://images.pexels.com/photos/8007049/pexels-photo-8007049.jpeg', 'Third Kit', true, 'Exclusive green-themed third kit for special matches', 40),
  ('Morocco Youth Jersey', 599.00, 'https://images.pexels.com/photos/17829899/pexels-photo-17829899.jpeg', 'Youth', false, 'Official youth jersey for young Atlas Lions fans', 70),
  ('Morocco Women Jersey', 799.00, 'https://images.pexels.com/photos/8007050/pexels-photo-8007050.jpeg', 'Women', true, 'Tailored fit jersey for female supporters', 55);
