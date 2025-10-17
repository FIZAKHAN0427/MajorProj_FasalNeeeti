# MongoDB Setup Instructions

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fasalneeti
   ```

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB
3. Start MongoDB service:
   ```cmd
   net start MongoDB

   
   ```
4. MongoDB will run on `mongodb://localhost:27017`

### Alternative: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verification

1. Start your backend server: `npm start`
2. Check console for "MongoDB connected" message
3. If connection fails, the app will continue with fallback behavior

## Database Structure

The app will automatically create:
- `users` collection (farmers and admins)
- `predictions` collection (yield predictions)
- `alerts` collection (weather alerts)

## Admin User Creation

After MongoDB is running, you can create an admin user through the registration endpoint with `role: 'admin'`.