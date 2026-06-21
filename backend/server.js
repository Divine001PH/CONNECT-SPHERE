// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');

// ===== CONFIG =====
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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

// ===== SOCKET.IO CONNECTION =====
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