# Use the official Node.js image as the base image
FROM node:18-alpine
# Set the working directory in the container to /app
WORKDIR /usr/src/app

# Copy the file from your host to your current location
COPY . .
# install dependencies
RUN yarn install

# build app
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
