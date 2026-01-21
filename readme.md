# StayEasy

**StayEasy** is an Airbnb-inspired room listing platform built using **Node.js, Express, MongoDB, and EJS**.
It focuses on clean architecture, server-side rendering, authentication, and real-world backend practices.

This project was built to understand how full-stack web applications work end-to-end — from user authentication to image uploads and access control.

---

## Overview

StayEasy allows users to explore rental listings, create their own listings, and leave reviews — all through a clean, familiar interface inspired by Airbnb.

The project emphasizes:

* Server-side rendering with EJS
* Secure authentication & authorization
* Clean middleware-driven architecture
* Scalable image handling using Cloudinary

---

## Features

* **User Authentication**

  * Signup & login using Passport.js
  * Secure password hashing with Passport-Local-Mongoose
  * Session-based authentication

* **Listings**

  * Create, edit, and delete listings
  * Image uploads handled via Cloudinary
  * Category-based filtering and search

* **Reviews**

  * Logged-in users can leave reviews
  * Star-rating system with custom UI
  * Review ownership validation

* **Authorization & Security**

  * Only owners can edit/delete their listings
  * Only authors can delete their reviews
  * Centralized middleware for access control

* **User Experience**

  * Flash messages for feedback
  * Global error handling
  * Clean, responsive UI inspired by Airbnb

---

## Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB, Mongoose
* **Authentication:** Passport.js, Passport-Local-Mongoose
* **Templating:** EJS + EJS-Mate
* **Image Storage:** Cloudinary + Multer
* **Styling:** Custom CSS + Bootstrap

---

## Important Setup Notes

You **must** configure environment variables before running the app.

Create a `.env` file in the root directory:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_strong_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/zameernagaral/StayEasy.git
cd StayEasy
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the server**

```bash
node index.js
```

4. **Visit the app**

```
http://localhost:8080
```

---

## Add Initial Dummy Data (Optional)

To seed the database with sample listings:

```bash
cd init
node index.js
```

---

## Learning Outcomes

This project helped solidify understanding of:

* Express middleware patterns
* Authentication & authorization flows
* MVC-style project structure
* Cloud-based image handling
* Real-world debugging (sessions, MongoDB, auth)

---

## Future Improvements

* Pagination for listings
* Role-based access (admin)
* Booking system with date availability
* OAuth login (Google)
* API version for frontend frameworks

---

## License

This project is for learning and demonstration purposes.

---

**Built with curiosity, persistence, and a lot of debugging.**
