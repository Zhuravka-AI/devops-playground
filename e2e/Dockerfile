# Use official Playwright image with pre-installed browsers matching our version (1.61.1)
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# Create app directory inside the container
WORKDIR /app

# Copy dependency definitions first to leverage Docker layer caching
COPY package*.json ./

# Install npm dependencies (Playwright test runner and TypeScript compiler)
# Note: We do NOT need to run 'npx playwright install' because browsers are already baked in!
RUN npm ci

# Copy the rest of the E2E testing framework codebase
COPY . .

# Default command to run the tests
# When running inside Docker, we target the container networks using environmental variables
ENV BASE_URL=http://nginx:80
CMD ["npm", "run", "test"]
