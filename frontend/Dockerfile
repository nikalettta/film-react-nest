# --- Сборка ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build

# --- Контейнер, который кладёт сборку в volume ---
FROM alpine:3.20
COPY --from=builder /app/dist /app/dist
CMD ["sh", "-c", "rm -rf /dist/* && cp -r /app/dist/. /dist/"]