FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/movie-ez/browser /usr/share/nginx/html
