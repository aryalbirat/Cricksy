FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port for Vite dev server
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
