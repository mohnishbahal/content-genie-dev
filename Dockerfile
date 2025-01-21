# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

# Use production node environment by default.
ENV NODE_ENV dev

# Copy package.json so that package manager commands can be used.
COPY . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

EXPOSE 8087

# Run the application.
CMD npm run dev