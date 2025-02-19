FROM node:22.14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
