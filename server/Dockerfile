# Use Node.js base image
FROM node:20

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Ensure `dist` is clean
# RUN rm -rf dist

# Expose port 3000
EXPOSE 3000

# Start the server with auto-recompilation
CMD sh -c "node dist/index.js"

