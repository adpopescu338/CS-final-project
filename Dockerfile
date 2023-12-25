FROM base-image:latest

# Set the working directory in the container to /app
WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN yarn prisma generate

# build app
RUN yarn build

EXPOSE 3000

CMD yarn start-prod