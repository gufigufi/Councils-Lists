# Council Map Finder 🗺️

A full-stack web application for displaying and managing councils on an interactive map. Users can search for nearby councils, and administrators can manage council data through a secure admin panel.

## Features

### Public Features
- 📍 Interactive OpenStreetMap displaying all councils
- 🔍 Search councils by address
- 📊 Find 5 nearest councils from any location
- 📏 Distance calculation in miles
- 🎯 Click councils to focus on map markers

### Admin Features
- 🔐 Secure authentication (login/logout)
- ➕ Create new councils with automatic geocoding
- ✏️ Edit existing councils
- 🗑️ Delete councils
- 📝 Manage council details: dates, contact info, location

## Tech Stack

### Frontend
- React 18 + Vite
- Leaflet.js (OpenStreetMap)
- React Router
- Axios

### Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Nominatim API (Geocoding)

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your database URL and JWT secret

# Initialize database
npx prisma migrate dev --name init
npx prisma generate

# Create admin user (optional)
npm run seed

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

## Usage

1. **Access the application**: Open `http://localhost:5173`
2. **Search for councils**: Enter an address in the search bar
3. **Admin panel**: Navigate to `/admin` and login

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ Change these credentials in production!**

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin user

### Councils (Public)
- `GET /api/councils` - Get all councils
- `POST /api/councils/search` - Find nearest councils

### Councils (Protected)
- `POST /api/councils` - Create council
- `PUT /api/councils/:id` - Update council
- `DELETE /api/councils/:id` - Delete council

## Project Structure

```
council-map-finder/
├── backend/          # Node.js API server
├── prisma/       # Database schema
└── src/          # Source code
└── frontend/         # React application
└── src/          # Components and services
```

## License

MIT
