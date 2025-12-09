# Usamos la misma base que tu contenedor viejo
FROM ubuntu:24.04

# Instalar Nginx para servir la web estática
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Copiar tu frontend al directorio de Nginx
COPY . /var/www/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
