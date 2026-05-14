# 🚀 API Rate Limiter (Node.js + Redis)

A scalable and production-ready **API Rate Limiter** built using **Node.js, TypeScript, and Redis**, implementing multiple rate limiting algorithms.

---

## 📌 Overview

This project demonstrates how to design and implement **rate limiting mechanisms** used in real-world backend systems to prevent abuse, ensure fair usage, and protect APIs from excessive traffic.

It includes:

* Token Bucket Algorithm (burst + refill)
* Sliding Window Algorithm (rolling limits)
* Redis-backed storage for distributed consistency
* Middleware-based architecture
* Dockerized setup
* Cloud deployment using Render + Upstash Redis

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express, TypeScript
* **Database:** Redis (Upstash Cloud)
* **Deployment:** Render
* **Containerization:** Docker
* **Logging:** Morgan

---

## 🧠 Rate Limiting Algorithms

### 1. Token Bucket

* Allows burst traffic
* Refills tokens over time
* Used for `/test` route

```txt
Limit: 5 requests
Refill: 1 request/sec
```

---

### 2. Sliding Window

* Tracks requests over rolling time window
* More accurate than fixed window
* Used for `/auth/login` route

```txt
Limit: 3 requests / 60 seconds
```

---

## 📂 Project Structure

```
src/
│
├── config/
│   └── redis.ts
│
├── middleware/
│   ├── tokenBucketRateLimiter.ts
│   ├── slidingWindowRateLimiter.ts
│   └── errorHandler.ts
│
├── routes/
│   ├── testRoute.ts
│   └── authRoute.ts
│
└── app.ts
```

---

## 🚀 Live API

👉 https://api-rate-limiter-bito.onrender.com

---

## 🧪 API Endpoints

### 🔹 Test Token Bucket

```
GET /test
```

Example:

```
https://api-rate-limiter-bito.onrender.com/test
```

---

### 🔹 Test Sliding Window

```
GET /auth/login
```

Example:

```
https://api-rate-limiter-bito.onrender.com/auth/login
```

---

## 🧪 Expected Behavior

### Token Bucket

```
200 200 200 200 200 → 429
(wait)
→ 200
```

---

### Sliding Window

```
200 200 200 → 429
```

---

## 💻 Local Setup

### 1. Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/api-rate-limiter.git
cd api-rate-limiter
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start Redis (locally)

```bash
redis-server
```

---

### 4. Run project

```bash
npm run dev
```

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
REDIS_URL=redis://localhost:6379
PORT=3000
```

---

## 🌐 Deployment

* Backend deployed on Render
* Redis hosted on Upstash

---

## ⚠️ Production Notes

* On free-tier hosting (Render), requests may be slower due to **cold starts**
* Rate limiting behavior may vary slightly due to **distributed instances**
* In real-world systems, rate limiting is typically applied per:

  * user ID
  * API key
  * authentication token

---

## 🧠 Key Learnings

* Designing scalable rate limiting systems
* Using Redis for distributed state management
* Middleware-based backend architecture
* Handling real-world deployment challenges
* Understanding limitations of cloud infrastructure

---

## 📈 Future Improvements

* API key based rate limiting
* Redis Lua scripts for atomic operations
* Dashboard for request analytics
* Multiple strategy toggling

---

## 📄 License

This project is open-source and available for learning purposes.

---

## 🙌 Acknowledgment

Built as a backend system design project to understand real-world API protection mechanisms.

---

