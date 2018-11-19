FROM openresty/openresty:alpine
ARG NGINX_CONFIG=nginx/local.nginx
COPY build /var/www
COPY $NGINX_CONFIG /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types
RUN mkdir -p /var/log/nginx
EXPOSE 80
ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-c","/etc/nginx/nginx.conf", "-g", "daemon off;"]