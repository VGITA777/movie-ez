FROM node AS builder
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build --production --omit=dev

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/movie-ez/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
