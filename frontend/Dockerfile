FROM node:24-alpine AS builder
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build --production --omit=dev

FROM nginx:1.28.0-alpine
COPY ./nginx /etc/nginx
COPY --from=builder /app/dist/movie-ez/browser /var/www/movieez.com/public
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
