# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim
WORKDIR /app
RUN npm install -g serve@14
COPY site ./site
ENV NODE_ENV=production
EXPOSE 3000
CMD ["serve", "site", "-l", "3000", "-n"]
