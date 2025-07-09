# 🏟️ Cricksy: A Cricksal Booking System

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/trwb_8GS)

**Cloud Project - Group 23**

A comprehensive full-stack web application for booking futsal courts with integrated payment processing, user management, and venue management capabilities.

## 🌟 Features

### 🎯 Core Functionality
- **Court Booking System**: Real-time booking with time slot management
- **Payment Integration**: Secure payments via Khalti payment gateway
- **Multi-Role Support**: Separate dashboards for Users, Owners, and Admins
- **Review System**: Rate and review futsal courts
- **Search & Filter**: Find courts by location, price, and availability

### 👥 User Roles
- **Regular Users**: Browse, book, and review futsal courts
- **Court Owners**: Manage their venues, view bookings, and handle court details
- **Administrators**: System-wide management and oversight

### 💳 Payment Features
- Integrated Khalti payment gateway
- Secure transaction processing
- Payment verification and confirmation
- Booking status management

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18** with modern hooks and functional components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for responsive styling
- **Framer Motion** for animations
- **Vite** for fast development and building

### Backend (Node.js + Express)
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Bcrypt** for password hashing
- **Joi** for data validation
- **Express-fileupload** for image handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/project-work-group-23.git
   cd project-work-group-23
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the Backend directory:
```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/CricksalHub

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Khalti Payment Gateway
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_URL=https://dev.khalti.com/api/v2/epayment/initiate/

# Server Configuration
PORT=8000
NODE_ENV=development
```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   Server runs on `http://localhost:8000`

3. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
project-work-group-23/
├── Backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controller/
│   │   ├── auth.js              # Authentication logic
│   │   ├── booking.js           # Booking management
│   │   ├── futsal.js            # Court management
│   │   ├── PaymentController.js # Payment processing
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── handleServerError.js # Error handling
│   ├── model/
│   │   ├── User.js              # User schema
│   │   ├── booking.js           # Booking schema
│   │   ├── Futsal.js           # Court schema
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── booking.js           # Booking routes
│   │   ├── futsal.js           # Court routes
│   │   └── ...
│   ├── uploads/                 # Image storage
│   └── server.js               # Main server file
├── Frontend/
│   ├── src/
│   │   ├── admin/              # Admin dashboard
│   │   ├── client/             # Client-side components
│   │   ├── owner/              # Owner dashboard
│   │   ├── features/           # Redux slices
│   │   ├── app/                # Redux store
│   │   └── App.jsx             # Main app component
│   ├── public/
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /become-owner` - Upgrade user to owner

### Courts (Futsal)
- `GET /cricksals` - Get all courts (with filters)
- `GET /cricksal/:id` - Get single court details
- `POST /cricksal` - Create new court (owner only)
- `PUT /cricksal/:id` - Update court (owner only)
- `DELETE /cricksal/:id` - Delete court (owner only)

### Bookings
- `POST /booking` - Create new booking
- `GET /bookings` - Get user bookings
- `GET /available-slots` - Check available time slots

### Payments
- `POST /initiate-payment` - Initialize Khalti payment
- `POST /verify-payment` - Verify payment completion

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notification system
- **JWT Decode** - JWT token handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **CORS** - Cross-origin resource sharing
- **Express-fileupload** - File upload handling
- **Moment.js** - Date/time manipulation

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with role-based access control:

- **JWT Tokens**: Secure user sessions
- **Role-based Access**: Different permissions for users, owners, and admins
- **Protected Routes**: Middleware authentication for sensitive endpoints
- **Password Security**: Bcrypt hashing for user passwords

## 💰 Payment Integration

Integrated with **Khalti Payment Gateway** for secure transactions:

- Real-time payment processing
- Payment verification
- Transaction status tracking
- Automatic booking confirmation

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive layouts for all screen sizes
- Touch-friendly interfaces
- Modern UI/UX design patterns

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment. Please refer to your institution's guidelines for usage and distribution.

## 👥 Team - Group 23

This project was developed as part of a cloud computing course assignment.

## 🐛 Issues & Support

If you encounter any issues or need support, please create an issue in the repository with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 🔮 Future Enhancements

- [ ] Real-time chat support
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced booking features (recurring bookings)
- [ ] Integration with more payment gateways
- [ ] Email notifications
- [ ] Social media integration

---

**Built by Group 23** 
