# Backend API - Event Map Finder

Backend REST API for Event Map Finder application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Seed database (optional):**
   ```bash
   npm run seed
   ```

5. **Start server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register admin

### Events (Public)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events/search` - Find nearest events

### Events (Protected)
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Technologies
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Nominatim Geocoding
