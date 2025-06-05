
# Etapa 1: Construcción (Builder)
# Usamos una imagen oficial de Node.js como base.
# Elige una versión LTS (Long Term Support) que sea compatible con tu proyecto.
# '-alpine' es una versión ligera, buena para producción.
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json (o yarn.lock / pnpm-lock.yaml)
# Esto aprovecha el almacenamiento en caché de capas de Docker. Si estos archivos no cambian,
# Docker no reinstalará las dependencias innecesariamente.
COPY package*.json ./

# Instalamos las dependencias del proyecto
# Si usas yarn o pnpm, cambia 'npm install' por 'yarn install' o 'pnpm install'
RUN npm install

# Copiamos el resto del código de la aplicación al directorio de trabajo
COPY . .

# Construimos la aplicación Next.js para producción
# Esto ejecutará el script 'build' definido en tu package.json
RUN npm run build

# Etapa 2: Producción (Runner)
# Usamos una imagen más ligera para la etapa de producción, ya que no necesitamos
# las dependencias de desarrollo ni el SDK de Node completo para ejecutar la app construida.
FROM node:18-alpine

WORKDIR /app

# Copiamos las dependencias de producción desde la etapa de construcción
# Necesitamos node_modules para ejecutar 'next start' si algunas dependencias son requeridas en tiempo de ejecución.
# Para Next.js, 'next start' típicamente necesita algunas dependencias.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiamos la carpeta .next (que contiene la aplicación construida) desde la etapa de construcción
COPY --from=builder /app/.next ./.next

# Copiamos la carpeta public
COPY --from=builder /app/public ./public

# Exponemos el puerto en el que Next.js se ejecuta por defecto en producción (3000)
# Si tu 'npm start' o next.config.js especifica un puerto diferente para producción, ajústalo aquí.
EXPOSE 3000

# El comando para iniciar la aplicación en producción
# Esto ejecutará el script 'start' definido en tu package.json ('next start')
CMD ["npm", "start"]
