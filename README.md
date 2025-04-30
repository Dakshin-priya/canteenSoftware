# 🥪 Canteen Management System

A full-stack web application to manage canteen billing, payments (wallet + UPI), and item ordering.

---

## 📦 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express.js + MongoDB
- **Database**: MongoDB (local or Atlas)
- **Styling**: Tailwind / CSS / Material UI (as per preference)

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js and npm
- MongoDB (running locally or use MongoDB Atlas)

---

## 📁 Backend Setup

1. Initialize the project:

   ```bash
   npm init -y

2. **Install backend dependencies:**

   ```bash
   npm install express mongoose cors body-parser
3. **Start the backend server:**

```bash
npm start
```
**By default, the backend runs on [http://localhost:5000](http://localhost:5000).**

## 👨‍💻 Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
2. **Install frontend dependencies:**
   ```bash
   npm install axios react-router-dom
3. **Start the development server:**
   ```bash
   npm run dev 
**By default, the frontend runs on http://localhost:5173.**

## 📝 Notes
- Make sure MongoDB is running locally or update your MongoDB Atlas URI in index.js.

- Replace the UPI ID in the PaymentOptions component for QR generation with your own.

## 📬 Feedback & Contributions
- Feel free to fork the project, open issues, or submit pull requests!
