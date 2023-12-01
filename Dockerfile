# Use the official Node.js image as the base image
FROM node:18-alpine
# Set the working directory in the container to /app
WORKDIR /usr/src/app

# Install PHP (For Adminer)
RUN apk --no-cache add php php-fpm php-json php-common php-session

# Copy the file from your host to your current location
COPY . .

ENV NODE_ENV=production
# install dependencies, lockfile
RUN yarn install --frozen-lockfile

# build app
RUN yarn build

EXPOSE 3000

CMD yarn prisma migrate deploy && yarn start
