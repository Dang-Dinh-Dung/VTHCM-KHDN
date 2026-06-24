# syntax=docker/dockerfile:1
# Multi-stage build cho Next.js 16 + Payload (standalone output)

FROM node:24.17.0-alpine AS base
RUN apk add --no-cache libc6-compat

# --- deps: cai dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- builder: build ung dung ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# PAYLOAD_SECRET can co khi build (generate importmap/types). Dung gia tri tam khi build.
ENV PAYLOAD_SECRET=build-time-placeholder
RUN npm run build

# --- runner: image chay production ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output + static + public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Thu muc media (upload) - mount volume vao day
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
