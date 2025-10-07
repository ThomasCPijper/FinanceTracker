# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Remix app
RUN npm run build


# ---------- RUNNER ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built app & node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Generate Prisma client again (optional safeguard)
RUN npx prisma generate

# Zorg dat Prisma migraties uitvoert bij start
CMD npx prisma migrate deploy && npm run start
