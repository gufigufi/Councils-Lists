# 🚀 Quick Start Guide - Event Map Finder

## Быстрый старт для разработки

### Шаг 1: Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend (в новом терминале)
cd frontend
npm install
```

### Шаг 2: Настройка PostgreSQL

**Вариант А: Локальная установка PostgreSQL**
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Создать базу данных
createdb event_map_db
```

**Вариант Б: Использовать Docker**
```bash
docker run --name event-map-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=event_map_db \
  -p 5432:5432 \
  -d postgres:14
```

### Шаг 3: Настройка Backend

Отредактируйте `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/event_map_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

**⚠️ Замените `username` и `password` на ваши данные PostgreSQL!**

### Шаг 4: Инициализация базы данных

```bash
cd backend

# Применить миграции Prisma
npx prisma migrate dev --name init

# Генерировать Prisma Client
npx prisma generate

# Создать админа и тестовые данные (опционально)
npm run seed
```

### Шаг 5: Запуск приложения

**Backend (терминал 1):**
```bash
cd backend
npm run dev
```
✅ Backend запущен на `http://localhost:3000`

**Frontend (терминал 2):**
```bash
cd frontend
npm run dev
```
✅ Frontend запущен на `http://localhost:5173`

### Шаг 6: Использование приложения

1. **Публичная карта**: Открыть `http://localhost:5173`
2. **Админ-панель**: Открыть `http://localhost:5173/admin`
   - Логин: `admin`
   - Пароль: `admin123`

---

## Основные функции

### Публичная часть
- 🗺️ Интерактивная карта с ивентами
- 🔍 Поиск по адресу
- 📏 Отображение 5 ближайших ивентов в милях
- 📍 Клик по ивенту для перехода к маркеру

### Админ-панель
- 🔐 Аутентификация
- ➕ Создание ивентов
- ✏️ Редактирование ивентов
- 🗑️ Удаление ивентов
- 🌍 Автоматическое геокодирование адресов

---

## Структура проекта

```
event-map-finder/
├── backend/              # Node.js API
│   ├── prisma/          # Database schema
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Geocoding & distance
│   │   ├── middleware/  # JWT authentication
│   │   └── server.js    # Main server
│   └── package.json
│
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Home/
│   │   │   ├── Map/
│   │   │   ├── Search/
│   │   │   ├── EventList/
│   │   │   └── Admin/
│   │   ├── services/    # API client
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## Решение проблем

### Ошибка подключения к БД
```bash
# Проверьте что PostgreSQL запущен
psql -U username -d event_map_db

# Проверьте DATABASE_URL в .env
```

### Ошибка "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### Порт уже занят
Измените PORT в `backend/.env` и обновите proxy в `frontend/vite.config.js`

---

## Production Build

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## API Endpoints

### Public
- `GET /api/events` - Все ивенты
- `POST /api/events/search` - Поиск ближайших

### Protected (требуется JWT)
- `POST /api/auth/login` - Вход
- `POST /api/events` - Создать ивент
- `PUT /api/events/:id` - Обновить
- `DELETE /api/events/:id` - Удалить

---

**Готово! 🎉 Ваше приложение запущено!**
