-- X-Mart Supabase Schema
-- Run this in your Supabase SQL Editor

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  address1 TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  birthday DATE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sku TEXT,
  label TEXT,
  stock_quantity INTEGER DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  compare_at_price NUMERIC(10,2) DEFAULT 0,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  colors TEXT,
  colors_array JSONB DEFAULT '[]',
  size TEXT,
  material TEXT,
  weight NUMERIC(10,2) DEFAULT 0,
  dimensions TEXT,
  description TEXT,
  specification TEXT,
  care_instructions TEXT,
  category TEXT,
  sub_category TEXT,
  type TEXT,
  tags TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url JSONB DEFAULT '[]',
  default_image_index INTEGER DEFAULT 0,
  sub_title TEXT,
  contant TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category showcase items
CREATE TABLE IF NOT EXISTS categories (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  category TEXT,
  image_url JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slider items
CREATE TABLE IF NOT EXISTS sliders (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  sub_title TEXT,
  specification TEXT,
  colors TEXT,
  category TEXT,
  contant TEXT,
  image_url JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme settings (single row)
CREATE TABLE IF NOT EXISTS theme_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#ec4899',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO theme_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- Shop settings (single row)
CREATE TABLE IF NOT EXISTS shop_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  shop_name TEXT DEFAULT 'X-Mart',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO shop_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- Contact details (single row)
CREATE TABLE IF NOT EXISTS contact_details (
  id TEXT PRIMARY KEY DEFAULT 'default',
  email TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO contact_details (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  image TEXT,
  name TEXT,
  price NUMERIC(10,2),
  size TEXT,
  quantity INTEGER DEFAULT 1,
  label TEXT,
  color TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  card_items JSONB NOT NULL DEFAULT '[]',
  customer_details JSONB NOT NULL DEFAULT '{}',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON products(sub_category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for product images (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
