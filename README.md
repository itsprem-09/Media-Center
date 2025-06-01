# Media Center

A full-featured media website inspired by The Hindu, complete with an admin panel to create, manage, and update all forms of content. The frontend matches The Hindu's layout, with content controlled entirely via the backend CMS.

## Technology Stack

- **Frontend**: React.js with React Router, Styled Components
- **Backend**: Node.js with Express.js
- **Database**: MongoDB using Mongoose
- **Authentication**: JWT with bcrypt for admin login
- **UI Library**: Material-UI for Admin Panel

## Features

### Frontend
- Responsive design matching The Hindu's layout
- Article reading with categories
- Photo galleries with lightbox view
- Video playback
- Category pages

### Admin Panel
- Secure login system using JWT
- Dashboard with content statistics
- Article management (create, read, update, delete)
- Photo gallery management
- Video management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd Media-Center
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Configure environment variables
   - Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mediaCenter
JWT_SECRET=your_secret_key_here
```

5. Create an admin user
```
cd ../backend
node scripts/create-admin.js
```
This will create an admin user with the email `admin@mediacenter.com` and password `admin123`

### Running the Application

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd frontend
npm start
```

3. Access the application
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - API: http://localhost:5000/api

## Project Structure

```
media-center/
├── backend/               # Backend code
│   ├── controllers/       # API controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded files
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
├── frontend/              # Frontend code
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── admin/         # Admin panel components
│       ├── assets/        # Images, icons, etc.
│       ├── components/    # Reusable components
│       ├── context/       # React context
│       ├── pages/         # Page components
│       └── utils/         # Utility functions
└── README.md              # This file
```

## License

This project is licensed under the MIT License.
