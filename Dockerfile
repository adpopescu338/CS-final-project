FROM base-image:latest

# Set the working directory in the container to /app
WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=production
# install dependencies, lockfile
RUN yarn install --frozen-lockfile

# build app
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start-prod"]
