FROM node:18.12-alpine3.16

ARG user=www-data
ARG group=www-data
ENV PROJECT_DIR=/app \
    APP_PORT=3000

# Set the working directory
WORKDIR $PROJECT_DIR

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY --chown=${group}:${user} . .

CMD ["npm", "start"]
