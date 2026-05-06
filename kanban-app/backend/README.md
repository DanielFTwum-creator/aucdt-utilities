# Kanban Task Management - Backend API

Production-ready Express + TypeScript + PostgreSQL backend for Kanban board management.

## Features

- ✅ User authentication (JWT)
- ✅ Board management with member permissions
- ✅ Lists (columns) with drag-and-drop positioning
- ✅ Cards (tasks) with full CRUD
- ✅ Card assignments and labels
- ✅ Comments and attachments
- ✅ Activity logging
- ✅ Real-time updates support
- ✅ Rate limiting and security

## Tech Stack

- **Runtime:** Node.js 22+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **Authentication:** JWT
- **Security:** Helmet, CORS, Rate Limiting

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb kanban_db

# Run migrations
psql kanban_db < src/config/database.sql
```

### 3. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Development Server
```bash
pnpm dev
```

Server runs on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Boards
- `GET /api/boards` - List user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board details
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/members` - Add board member
- `DELETE /api/boards/:id/members/:userId` - Remove member

### Lists
- `GET /api/lists?boardId=:boardId` - Get board lists
- `POST /api/lists` - Create list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list
- `PUT /api/lists/:id/position` - Update list position

### Cards
- `GET /api/cards?listId=:listId` - Get list cards
- `POST /api/cards` - Create card
- `GET /api/cards/:id` - Get card details
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `PUT /api/cards/:id/position` - Move card
- `POST /api/cards/:id/members` - Assign member
- `POST /api/cards/:id/labels` - Add label
- `POST /api/cards/:id/comments` - Add comment
- `POST /api/cards/:id/attachments` - Upload attachment

### Users
- `GET /api/users` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile

## Database Schema

See `src/config/database.sql` for complete schema.

**Core Tables:**
- users
- boards
- board_members
- lists
- cards
- card_members
- labels
- card_labels
- comments
- attachments
- activity_log

## Development

### Run Tests
```bash
pnpm test
```

### Build for Production
```bash
pnpm build
pnpm start
```

### Docker Development
```bash
docker build -t kanban-backend .
docker run -p 3001:3001 --env-file .env kanban-backend
```

## Security

- JWT token authentication
- Bcrypt password hashing
- Helmet.js security headers
- CORS configuration
- Rate limiting (100 requests/15min)
- Input validation with Zod
- SQL injection prevention

## Environment Variables

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/kanban_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Enable HTTPS
5. Set up database backups
6. Configure logging
7. Monitor performance

## Next Steps

- [ ] Implement WebSocket for real-time updates
- [ ] Add file upload to cloud storage
- [ ] Implement board templates
- [ ] Add advanced search
- [ ] Implement notifications
- [ ] Add audit trail export
- [ ] Implement board archiving

## License

ISC

## Support

For issues or questions, contact the development team.
