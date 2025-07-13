# Payments Web App

A full-stack payments web application built with React, Node.js, and MongoDB.
Users can send and receive funds, view transaction history, and search for other users.

---

## ✨ Features

* ✅ User Authentication (JWT-based)
* ✅ Send & Receive Money Between Users
* ✅ Transaction History with Running Balance
* ✅ Search Users (With Debounce and Filtering)
* ✅ Responsive UI (Mobile + Desktop Friendly)

---

## ⚙️ Tech Stack

| Frontend     | Backend           | Database | Hosting         |
| ------------ | ----------------- | -------- | --------------- |
| React + Vite | Node.js + Express | MongoDB  | Vercel + Render |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* MongoDB Atlas or Local MongoDB

### Installation Steps

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/prathambhatia/payments-app.git
cd payments-app
```

#### 2️⃣ Install Dependencies

For frontend:

```bash
cd client
npm install
```

For backend:

```bash
cd server
npm install
```

#### 3️⃣ Setup Environment Variables

Create `.env` files in both `client/` and `server/` folders:

**client/.env**

```
VITE_API_URL=https://your-backend-url.com
```

**server/.env**

```
MONGODB_URL=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

#### 4️⃣ Run the App Locally

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm run dev
```

---

## 🛠️ Folder Structure

```
/client
  /src
    /components
    /pages
    /hooks
/server
  /routes
  /models
```

---

## ✅ Known Limitations / Future Improvements

* Pagination for users and transactions.
* Wallet recharge integrations.
* Profile pictures via file uploads.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ✉️ Contact

* Developer: Pratham Bhatia
* GitHub: [https://github.com/prathambhatia](https://github.com/prathambhatia)
