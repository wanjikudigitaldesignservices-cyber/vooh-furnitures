-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Branches Table
CREATE TABLE public.branches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    city text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    email text,
    hours text,
    latitude numeric,
    longitude numeric,
    is_hq boolean DEFAULT false
);

-- Products Table
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    price numeric NOT NULL,
    original_price numeric,
    category text NOT NULL,
    images text[],
    branch_stock jsonb,
    is_featured boolean DEFAULT false,
    is_new boolean DEFAULT false,
    rating numeric DEFAULT 4.5,
    review_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    delivery_address text,
    delivery_city text,
    items jsonb NOT NULL,
    subtotal numeric NOT NULL,
    delivery_fee numeric DEFAULT 0,
    total numeric NOT NULL,
    status text DEFAULT 'pending',
    paystack_ref text UNIQUE,
    branch_pickup text,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Testimonials Table
CREATE TABLE public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    city text NOT NULL,
    rating integer DEFAULT 5,
    review text NOT NULL,
    product text,
    avatar_initials text,
    created_at timestamptz DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE public.newsletter_subscribers (
    email text PRIMARY KEY,
    created_at timestamptz DEFAULT now()
);

-- Contact Messages
CREATE TABLE public.contact_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    branch text,
    subject text,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for products, branches, testimonials
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read access for branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON public.testimonials FOR SELECT USING (true);

-- Allow anonymous inserts for orders, newsletter, contact_messages
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow users to read their own orders
CREATE POLICY "Allow users to read their own orders" ON public.orders FOR SELECT USING (true);

-- Seed Branches
INSERT INTO public.branches (name, city, address, phone, email, hours, is_hq) VALUES
('Nairobi HQ', 'Nairobi', 'Westlands Commercial Centre, Waiyaki Way, Nairobi', '+254 700 000 001', 'hq@voohfurnitures.co.ke', 'Mon–Sat 8AM–7PM, Sun 10AM–5PM', true),
('Kisumu', 'Kisumu', 'Mega City Mall, Oginga Odinga Street, Kisumu', '+254 700 000 002', 'kisumu@voohfurnitures.co.ke', 'Mon–Sat 9AM–6PM', false),
('Mombasa', 'Mombasa', 'City Mall, Nyali, Mombasa', '+254 700 000 003', 'mombasa@voohfurnitures.co.ke', 'Mon–Sat 9AM–6PM', false),
('Kericho', 'Kericho', 'Tea Estate Road, Kericho Town', '+254 700 000 004', 'kericho@voohfurnitures.co.ke', 'Mon–Sat 9AM–6PM', false),
('Eldoret', 'Eldoret', 'Zion Mall, Uganda Road, Eldoret', '+254 700 000 005', 'eldoret@voohfurnitures.co.ke', 'Mon–Sat 9AM–6PM', false);

-- Seed Products
INSERT INTO public.products (name, slug, description, price, original_price, category, images, branch_stock, is_featured, is_new) VALUES
('Grey Sectional Sofa', 'grey-sectional-sofa', 'Premium L-shaped grey sectional sofa perfect for modern living rooms.', 145000, 165000, 'Living Room', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85&fit=crop'], '{"Nairobi HQ": 5, "Mombasa": 2}', true, true),
('Velvet Accent Chair', 'velvet-accent-chair', 'Luxurious velvet accent chair adding a pop of color and comfort.', 45000, NULL, 'Living Room', ARRAY['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=85&fit=crop'], '{"Nairobi HQ": 10, "Kisumu": 4}', false, false),
('Oak Coffee Table', 'oak-coffee-table', 'Solid oak coffee table with a minimalist design.', 32000, 38000, 'Living Room', ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85&fit=crop'], '{"Nairobi HQ": 8}', false, false),
('Walnut TV Unit', 'walnut-tv-unit', 'Sleek walnut TV unit with ample storage space.', 65000, NULL, 'Living Room', ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&fit=crop'], '{"Nairobi HQ": 3, "Eldoret": 1}', false, false),

('Upholstered King Bed', 'upholstered-king-bed', 'Elegant king size bed with a soft upholstered headboard.', 185000, 210000, 'Bedroom', ARRAY['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=85&fit=crop'], '{"Nairobi HQ": 4, "Mombasa": 1}', true, false),
('4-Door Wardrobe', '4-door-wardrobe', 'Spacious 4-door wardrobe with full-length mirrors.', 120000, NULL, 'Bedroom', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&fit=crop'], '{"Nairobi HQ": 2}', false, true),
('Dresser with Mirror', 'dresser-with-mirror', 'Classic wooden dresser featuring 6 drawers and a matching mirror.', 75000, NULL, 'Bedroom', ARRAY['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=85&fit=crop'], '{"Nairobi HQ": 6, "Kisumu": 2}', false, false),
('Nightstand Set', 'nightstand-set', 'Set of two matching modern nightstands.', 25000, 30000, 'Bedroom', ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85&fit=crop'], '{"Nairobi HQ": 15, "Kericho": 5}', false, false),

('6-Seater Dining Table', '6-seater-dining-table', 'Solid wood 6-seater dining table for family gatherings.', 95000, 110000, 'Dining', ARRAY['https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&q=85&fit=crop'], '{"Nairobi HQ": 3, "Eldoret": 2}', true, false),
('Dining Chairs (Set of 4)', 'dining-chairs-set-4', 'Comfortable upholstered dining chairs.', 48000, NULL, 'Dining', ARRAY['https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&q=85&fit=crop'], '{"Nairobi HQ": 10, "Mombasa": 5}', false, false),
('Buffet Cabinet', 'buffet-cabinet', 'Stylish buffet cabinet for your dining room essentials.', 78000, NULL, 'Dining', ARRAY['https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=85&fit=crop'], '{"Nairobi HQ": 4}', false, false),

('Executive Desk', 'executive-desk', 'Premium executive desk perfect for home offices.', 85000, 95000, 'Home Office', ARRAY['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=85&fit=crop'], '{"Nairobi HQ": 6}', true, true);

-- Seed Testimonials
INSERT INTO public.testimonials (name, city, rating, review, product, avatar_initials) VALUES
('Amina K.', 'Nairobi', 5, 'The grey sectional sofa transformed my living room completely. Delivery was prompt and professional.', 'Grey Sectional Sofa', 'AK'),
('Brian O.', 'Kisumu', 5, 'Exceptional quality. The executive desk is sturdy and looks incredibly premium in my home office.', 'Executive Desk', 'BO'),
('Sarah M.', 'Mombasa', 4, 'Very happy with the dining set. It fits perfectly in our space and the chairs are very comfortable.', '6-Seater Dining Table', 'SM'),
('John D.', 'Eldoret', 5, 'Great customer service and the bed is exactly as pictured online. Will definitely shop here again.', 'Upholstered King Bed', 'JD');
