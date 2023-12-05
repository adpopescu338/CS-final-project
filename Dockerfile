FROM base-image:latest

# Set the working directory in the container to /app
WORKDIR /app

COPY . .

ENV NODE_ENV=production

# install dependencies, lockfile
# deps should already be installed in base-image, but just in case package.json changes
RUN yarn install --frozen-lockfile

RUN yarn prisma generate

# build app
RUN yarn build

EXPOSE 3000

# Create a cron job to perform the request every 2 minutes
RUN echo "*/2 * * * * /usr/bin/curl -s http://localhost:3000/api/cron" >> /etc/crontabs/root


# Start cron in the background and then your application
CMD crond -l 2 -f & yarn start-prod