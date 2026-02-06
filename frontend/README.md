# Frontend - Event Map Finder

React application for Event Map Finder with interactive map and admin panel.

## Features

- Interactive OpenStreetMap with event markers
- Search events by address
- Find 5 nearest events
- Distance calculation in miles
- Responsive design
- Admin panel with authentication
- CRUD operations for events

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure backend URL (if needed):**
   Edit `vite.config.js` proxy settings if backend is on different host/port.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Home/           # Main page with map
│   ├── Map/            # Leaflet map component
│   ├── Search/         # Address search
│   ├── EventList/      # Event list sidebar
│   └── Admin/          # Admin components
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── EventForm.jsx
│       └── ProtectedRoute.jsx
├── services/
│   └── api.js          # API client
├── utils/
│   └── helpers.js      # Utility functions
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## Technologies

- React 18
- Vite
- React Router
- Leaflet.js
- Axios
- CSS3

## Available Routes

- `/` - Public map view
- `/admin/login` - Admin login
- `/admin` - Admin dashboard (protected)
- `/admin/events/new` - Create event (protected)
- `/admin/events/edit/:id` - Edit event (protected)
