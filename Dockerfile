FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy project files
COPY . .

# Prisma: generate client
RUN npx prisma generate

# Build Remix
RUN npm run build


