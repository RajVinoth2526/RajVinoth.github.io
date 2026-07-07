# X-Mart

E-commerce application built with **Angular**, **Node.js**, and **Supabase**.

## Architecture

- **Frontend**: Angular 14 (`src/`)
- **Backend**: Node.js Express API (`server/`)
- **Database / Auth / Storage**: Supabase

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
3. Create a storage bucket named `product-images` (public)
4. Copy your project URL, anon key, and service role key

### 2. Backend (Node.js)

```bash
cd server
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run dev
```

Server runs at `http://localhost:3000`

### 3. Frontend (Angular)

Update `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
  }
};
```

```bash
npm install
ng serve
```

App runs at `http://localhost:4200`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (paginated) |
| POST | `/api/products` | Create product |
| GET | `/api/products/categories` | List categories |
| GET | `/api/products/sliders` | List sliders |
| GET/POST | `/api/cart` | Cart operations |
| GET/POST | `/api/orders` | Order operations |
| GET/PUT | `/api/settings/*` | Theme, shop, contact |
| POST | `/api/upload` | Image upload |
| POST | `/api/payment` | Payment processing |

## Development server

Run `ng serve` for the Angular dev server. Navigate to `http://localhost:4200/`.
