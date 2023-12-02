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

CMD ["yarn", "start-prod"]
