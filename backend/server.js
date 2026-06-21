// ===== IMPORTS =====
const authRoutes = require('./routes/authRoutes');

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// ===== CONFIG =====
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // We'll restrict this later for security
  },
});

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== ROUTES =====
app.use('/api/auth', authRoutes);

// ===== TEST ROUTE =====
app.get('/', (req, res) => {
  res.send('ConnectSphere API is running 🚀');
});

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ===== SOCKET.IO CONNECTION (basic setup for now) =====
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});