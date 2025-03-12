# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
