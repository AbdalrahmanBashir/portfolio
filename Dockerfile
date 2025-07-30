FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and all source files before install
COPY . .

# Install dependencies (this will also trigger postinstall → tailwind build)
RUN npm install

# Set the port used by Cloud Run
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
