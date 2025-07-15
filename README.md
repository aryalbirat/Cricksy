# 🏟️ Cricksy: Futsal Court Booking System

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/trwb_8GS)

**Cloud Project - Group 23**

A comprehensive full-stack web application for booking futsal courts, built with React.js and Node.js. The platform enables users to discover, book, and manage futsal court reservations while providing separate dashboards for owners and administrators.

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with secure token handling
- **Role-based Access Control** (User, Owner, Admin)
- **User Registration & Login** with email validation
- **Password Security** using bcrypt hashing
- **Profile Management** with image upload capability
- **Role Upgrade System** (User to Owner)

### 🏟️ Court Management
- **Court Discovery** with advanced search and filtering
- **Location-based Search** with price range filters
- **Sort by Price** (ascending/descending)
- **Detailed Court View** with multiple image galleries
- **Owner Court CRUD** operations (Create, Read, Update, Delete)
- **Admin Court Oversight** across all owners

### 📅 Advanced Booking System
- **Real-time Availability** checking with conflict prevention
- **Date & Time Slot Selection** with validation
- **Booking Status Tracking** (upcoming, completed, cancelled)
- **Automatic Status Updates** based on current time
- **Booking History Management** for users
- **Owner Booking Analytics** for revenue tracking
- **Admin Booking Management** with edit/delete capabilities

### ⭐ Review & Rating System
- **5-Star Rating System** for courts
- **Written Reviews** with 500-character limit
- **Verified Reviews** (only from users with completed bookings)
- **Average Rating Calculation** automatically updated
- **Review Management** for owners and admins
- **Search Reviews** by user or court name

### 👥 Multi-Dashboard System

#### **User Dashboard**
- Personal profile management with image upload
- Complete booking history with status tracking
- Court search and discovery
- Review submission for completed bookings
- Account settings and password management

#### **Owner Dashboard**
- Court management (add, edit, delete courts)
- Booking overview for all owned courts
- Review monitoring with search and filter
- Revenue analytics and booking statistics
- Profile management with owner-specific fields

#### **Admin Dashboard**
- Complete system oversight and control
- User management with role assignment
- Court management across all owners
- Booking management with full edit/delete access
- Review monitoring and moderation
- System analytics and reporting
- Dark theme with modern gradient design

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18** - Modern React with Hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Axios** - HTTP client for API communication
- **React Toastify** - Toast notifications
- **Lucide React & React Icons** - Icon libraries
- **JWT Decode** - JWT token handling
- **Date-fns** - Date manipulation library
- **Vite** - Fast build tool and development server

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Express File Upload** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Moment.js & Date-fns** - Date/time manipulation
- **Dotenv** - Environment variable management

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd project-work-group-23
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the Backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/Cricksy

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=8000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads
```

### Database Setup

1. **Start MongoDB Service**
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud connection
   # Update MONGODB_URI in .env file
   ```

2. **Create Admin User**
   ```bash
   cd Backend
   node createAdmin.js
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd Backend
   npm run dev    # Development mode with nodemon
   # or
   npm start      # Production mode
   ```
   🌐 Backend runs on `http://localhost:8000`

2. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   🌐 Frontend runs on `http://localhost:5173`

### Default Admin Credentials
- **Email:** `admin@cricksy.com`
- **Password:** `11111111`

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
