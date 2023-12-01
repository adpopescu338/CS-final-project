FROM base-image:latest

COPY . .

ENV NODE_ENV=production

# build app
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start-prod"]
