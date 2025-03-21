# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy only necessary files for package installation
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Add a health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
