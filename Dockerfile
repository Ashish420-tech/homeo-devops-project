# Step 1: Use official Node.js image
FROM node:18-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Step 4: Copy the rest of the app
COPY . .

# Step 5: Expose port
EXPOSE 3000

# Step 6: Start the app
CMD ["npm", "start"]

