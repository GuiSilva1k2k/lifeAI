FROM node:22.15.0 as builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/lifeai-front/browser usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
EXPOSE 90
CMD ["nginx", "-g", "daemon off;"]