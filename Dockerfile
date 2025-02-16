# --- Stage 1: Build server ---
FROM node:22-alpine AS server-build

# Set working directory
WORKDIR /app

# Install dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install --production

# Copy source code
COPY server/ ./

# Build the server
RUN npm run build


# --- Stage 2: Build client ---
FROM node:22-alpine AS client-build

# Set working directory
WORKDIR /app

# Install dependencies
COPY client/package.json client/package-lock.json ./
RUN npm install --production

# Copy source code
COPY client/ ./

# Build the client
RUN npm run build


# --- Stage 3: Create the final production image ---
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy the compiled server files
COPY --from=server-build /app/node_modules /app/node_modules
COPY --from=server-build /app/dist/src/server.js /app/server.js

# Copy the built client files into the server's /public directory
COPY --from=client-build /app/dist /app/public

# Expose the port the server runs on
EXPOSE 3000

# Command to start the server
CMD ["node", "server.js"]