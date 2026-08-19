# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY web/package.json web/package-lock.json ./web/
RUN cd web && npm ci
COPY web ./web
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/web
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
COPY --from=build /app/web /app/web
COPY heal-log.md /app/heal-log.md
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV WOLVERINE_DB=/data/wolverine.db
ENV WOLVERINE_HEAL_LOG=/data/heal-log.md
WORKDIR /app/web
EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
