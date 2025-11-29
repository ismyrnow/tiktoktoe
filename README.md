# TikTokToe

A real-time multiplayer Tic-Tac-Toe game built with React, TypeScript, Socket.IO, and Express.

## Architecture

This application consists of two main parts:
- **Client**: React + TypeScript frontend built with Vite
- **Server**: Node.js + Express backend with Socket.IO for real-time multiplayer gameplay

## Prerequisites

- Node.js 22.x or higher
- npm

## Development Setup

### Running the Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The server will start on port 3000 (or the port specified in the `PORT` environment variable) and automatically restart on file changes using nodemon.

### Running the Client

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The client will start on port 5173 (default Vite port) and open in your browser.

## Production Build

### Option 1: Build and Run Locally

1. Build the server:
   ```bash
   cd server
   npm run build
   ```

2. Build the client:
   ```bash
   cd client
   npm run build
   ```

3. Copy the client build to the server's public directory:
   ```bash
   cp -r client/dist/* server/public/
   ```

4. Run the production server:
   ```bash
   cd server
   npm start
   ```

The application will be served at `http://localhost:3000`

### Option 2: Using Docker

Build and run the application using Docker:

```bash
docker build -t tiktoktoe .
docker run -p 3000:3000 tiktoktoe
```

The application will be available at `http://localhost:3000`

## How to Play

1. Open the application in two different browser windows or share the URL with a friend
2. The first player creates a game and waits for a second player to join
3. Once both players are connected, take turns placing X's and O's
4. The first player to get three in a row wins!

## License

MIT

