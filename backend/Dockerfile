# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev

# Copy build artifacts and prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment setup
ENV NODE_ENV=production
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
