FROM node:14-alpine AS build-backend

WORKDIR /usr/ba-app/

COPY ./backend/package.json ./backend/yarn.lock ./

RUN yarn install --frozen-lockfile
COPY ./backend/ ./
RUN yarn build

# /usr/ba-app/dist <- output

FROM node:14-alpine AS build-frontend

WORKDIR /usr/fr-app/

COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./frontend/ ./
ENV INLINE_RUNTIME_CHUNK=false
RUN yarn build

# /usr/fr-app/build <- output

FROM node:14-alpine AS build-dependencies
WORKDIR /usr/deps

COPY ./backend/package.json ./backend/yarn.lock ./
RUN yarn install --production --frozen-lockfile
RUN yarn autoclean

FROM gcr.io/distroless/nodejs:14

COPY --from=build-backend /usr/ba-app/dist /dist
COPY --from=build-dependencies /usr/deps/node_modules /node_modules
COPY --from=build-frontend /usr/fr-app/build /public

EXPOSE 3001

CMD ["dist/main.js"]