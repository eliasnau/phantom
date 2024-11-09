FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for ts-node)
RUN npm install

# Copy source
COPY . .

# Generate Prisma client only
RUN npx prisma generate

# Set environment variables
ENV NODE_ENV=production

EXPOSE 3000

# Run directly with ts-node
CMD ["npx", "ts-node", "./src/app.ts"]