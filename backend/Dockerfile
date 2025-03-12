# Use Node.js image
FROM node:22.13.1-alpine AS build

# Set working directory
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production Stage
FROM node:22.13.1-slim

# Expose port and start app
WORKDIR /app
COPY --from=build /app /app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

RUN npm prune --production  # Remove development dependencies
EXPOSE 5001
CMD ["npm", "run", "start"]