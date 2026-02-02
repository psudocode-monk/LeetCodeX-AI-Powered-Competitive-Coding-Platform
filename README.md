# 🚀 LeetCodeX — AI Powered Competitive Coding Platform

A **production-grade coding platform** inspired by LeetCode, built end-to-end with a strong focus on **backend correctness, execution pipelines, security, and system design**.

LeetCodeX supports **problem creation, code execution, submissions, AI-assisted problem solving, and video editorials**, all integrated into a single scalable system.

> ⚠️ This project is **not affiliated with LeetCode**. It is built purely for learning, experimentation, and engineering practice.

---

## ✨ Features

### 👤 Authentication & Security
- JWT authentication using **HTTP-only cookies**
- Role-based access control (`user`, `admin`)
- Secure logout via **Redis token blocklisting**
- Persistent login validation (`/user/check`)
- Password hashing with **bcrypt**

---

### 🧩 Problem Management (Admin)
- Create, update, and delete coding problems
- Supports:
  - Difficulty levels: **Easy / Medium / Hard**
  - Tags: Array, Linked List, Graph, DP
  - Visible & hidden test cases
  - Multi-language starter code (C++, Java, JavaScript)
  - Reference solutions
- **Reference solutions are validated using Judge0 before saving**

---

### ⚙️ Code Execution & Submissions
- Integrated with **Judge0 API**
- Two execution modes:
  - **Run** → visible test cases
  - **Submit** → hidden test cases
- Tracks:
  - Accepted / Wrong Answer / Runtime Error
  - Execution time
  - Memory usage
  - Passed vs total test cases
- Full submission history per problem

---

### 📊 User Progress Tracking
- Automatically marks problems as solved upon acceptance
- Fetch solved problems per user
- Detailed submission history with code viewer

---

### 🎥 Video Editorial System (Admin)
- Secure **direct video uploads to Cloudinary**
- Signed uploads with backend verification
- Stores:
  - Secure video URL
  - Thumbnail
  - Duration
- Supports deletion & cleanup

---

### 🤖 AI-Powered DSA Assistant
- Powered by **Google Gemini**
- Context-aware assistance per problem
- Capabilities:
  - Step-by-step hints
  - Code review & debugging
  - Optimal solution explanations
  - Time & space complexity analysis
- **Strictly limited to the current DSA problem**
- No unrelated topics allowed

---

## 🛠️ Tech Stack

### Frontend
- React + React Router
- Redux Toolkit
- Tailwind CSS + DaisyUI
- Monaco Editor

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Redis (token invalidation)
- JWT Authentication
- Judge0 API (code execution)
- Cloudinary (video storage)
- Google Gemini API (AI assistant)

---

## 🧠 System Design Highlights

- Direct-to-Cloudinary uploads (no server file handling)
- Token invalidation using Redis blocklist
- Pre-validation of reference solutions with Judge0
- Separate execution pipelines for **run** vs **submit**
- Modular controller-service architecture
- Scalable design ready for production hardening

---


---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- Redis
- Judge0 API key
- Cloudinary credentials
- Google Gemini API key

---

### 🏗️ System Architecture

┌────────────┐        ┌──────────────┐
│  Frontend  │        │   Admin UI   │
│  (React)   │        │  (React)     │
└─────┬──────┘        └──────┬───────┘
      │  HTTP (Cookies)             │
      └──────────────┬──────────────┘
                     ▼
             ┌──────────────┐
             │   Express    │
             │   Backend    │
             └──────┬───────┘
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
 ┌──────────┐  ┌───────────┐  ┌───────────┐
 │ MongoDB  │  │   Redis   │  │ Cloudinary│
 │ (Data)   │  │ (Tokens)  │  │ (Videos)  │
 └──────────┘  └───────────┘  └───────────┘
        │
        ▼
 ┌──────────────────┐
 │   Judge0 API     │
 │ (Code Execution) │
 └──────────────────┘
        │
        ▼
 ┌──────────────────┐
 │ Google Gemini AI │
 │ (DSA Assistant)  │
 └──────────────────┘
