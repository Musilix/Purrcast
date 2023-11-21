# Builder Stage
FROM node:20.9.0 AS builder

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies - npm ci installs from package lock, only=production only install devDependencies
RUN npm ci --only=production

# Bundle app source inside Docker image
COPY . .

# Build the application
RUN npm run build

# -------------------------------------------------------------------------------------------
# --- Runner Stage --------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------

FROM node:20.9.0 AS runner
WORKDIR /usr/src/app

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app .

# Use non-root user for better security
USER node

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "dist/main.js" ]
