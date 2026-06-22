# Use the official Node runtime engine
FROM node:18-alpine

# Create an app directory inside the container
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install the packages inside the container
RUN npm install

# Copy your actual Tic Tac Toe source code
COPY . .

# Expose the port React dev server runs on
EXPOSE 3000

# Run the dev server directly so it logs runtime errors to the container terminal
CMD ["npm", "start"]
