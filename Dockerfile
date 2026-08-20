# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY web/package.json web/package-lock.json ./web/
RUN cd web && npm ci
COPY web ./web
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/web
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/web/out ./out
ENV NODE_ENV=production
EXPOSE 3000
CMD ["serve", "out", "-l", "3000", "-n"]
