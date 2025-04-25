const express = require('express');
const multer = require('multer');
const path = require('path');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const cors = require('cors'); 
dotenv.config({path: './Backend/.env'});

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Debug environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);


// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Configure Cloudinary
// if (!process.env.CLOUDINARY_URL) {
//   console.error('Error: CLOUDINARY_URL is not defined in .env file');
//   process.exit(1);
// }


// Routes
app.use('/api/users', require('./Backend/Routes/UserRoutes'));
app.use('/api/blogs', require('./Backend/Routes/BlogRoutes'));
app.use('/api/follows', require('./Backend/Routes/FollowRoutes'));
app.use('/api/likes', require('./Backend/Routes/LikeRoutes'));
app.use('/api/comments', require('./Backend/Routes/CommentRoutes'));
app.use('/api/orders', require('./Backend/Routes/OrderRoutes'));
app.use('/api/notifications', require('./Backend/Routes/NotificationRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));