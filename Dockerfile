# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ---- Runtime stage ----
# Nota: el módulo nginx-mod-http-brotli de apk NO es binario-compatible con la
# imagen oficial de nginx (distintos flags de compilación). Se usa solo gzip.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Eliminar las directivas brotli del conf (gzip sigue activo)
RUN sed -i -e '/^[[:space:]]*brotli_types/,/;/d' \
           -e '/^[[:space:]]*brotli[[:space:]_]/d' /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]