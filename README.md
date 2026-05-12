# API Rate Limiter

A custom API Rate Limiter built using Node.js, Express.js, TypeScript, and Redis.

This project implements multiple rate limiting algorithms from scratch and demonstrates backend middleware architecture, Redis integration, and distributed systems concepts.

---

# Features

- Fixed Window Rate Limiting
- Sliding Window Rate Limiting
- Redis-based request tracking
- Dockerized Redis setup
- Configurable middleware
- HTTP 429 handling
- Retry-After headers
- X-RateLimit headers
- IP-based request limiting
- TypeScript support
- Express middleware architecture

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- Redis
- Docker

---

# Project Structure

```bash
src/
├── config/
│   └── redis.ts
├── middleware/
│   ├── rateLimiter.ts
│   └── slidingWindowRateLimiter.ts
├── routes/
│   └── testRoute.ts
└── app.ts
