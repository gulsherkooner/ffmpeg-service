# Use Node.js 20
FROM node:20-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY index.js ./
COPY src/ ./src/

EXPOSE 8567

CMD ["node", "index.js"]