FROM node:16-alpine AS build-backend

WORKDIR /usr/app/

COPY ./package.json ./yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

FROM node:16-alpine AS build-dependencies
WORKDIR /usr/deps

COPY ./package.json ./yarn.lock ./
RUN yarn install --production --frozen-lockfile
RUN yarn autoclean

FROM gcr.io/distroless/nodejs:16

COPY --from=build-backend /usr/app/dist /dist
COPY --from=build-backend /usr/app/migrations /migrations
COPY --from=build-dependencies /usr/deps/node_modules /node_modules

EXPOSE 3000

CMD ["dist/entrypoint.js"]
