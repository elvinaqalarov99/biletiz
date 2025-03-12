# Use an official Node.js runtime as a parent image
FROM node:22.13.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight image for production
FROM node:22.13.1-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Run Next.js in production mode
CMD ["npm", "run", "start"]
