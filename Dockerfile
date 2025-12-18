FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

RUN npm ci

COPY . .

RUN npm run build

# ===========================
# Runtime stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001
ENV LOG_LEVEL=info

# Puppeteer optimizations for Docker
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV PUPPETEER_DISABLE_DEV_SHM_USAGE=true

# Install dependencies for Puppeteer / Chromium on Debian
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libgtk-4-1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libxss1 \
    libgconf-2-4 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/data ./data
COPY --from=builder /app/server/services/pdf/templates ./server/services/pdf/templates
COPY --from=builder /app/server/services/pdf/fonts ./server/services/pdf/fonts
COPY --from=builder /app/public ./public

EXPOSE 5001

CMD ["node", "dist/index.js"]
