import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import requestRoute from "./routes/request.route.js";
import projectRoute from "./routes/project.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

// استيراد الثوابت (إذا كانت موجودة)
let colors, title, options;
try {
  const constants = await import("./constants.js");
  colors = constants.colors;
  title = constants.title;
  options = constants.options;
} catch (error) {
  // إذا لم يكن ملف constants موجوداً، استخدم قيم افتراضية
  colors = {
    bg: { blue: '\x1b[44m', red: '\x1b[41m', yellow: '\x1b[43m' },
    fg: { white: '\x1b[37m', blue: '\x1b[34m', cyan: '\x1b[36m', yellow: '\x1b[33m', green: '\x1b[32m' },
    reset: '\x1b[0m'
  };
  title = "🎯 API Server";
}

const app = express();
dotenv.config();

// إعدادات MongoDB محسنة
mongoose.set("strictQuery", true);

// تحسين اتصال MongoDB مع إعدادات متوافقة مع Render
const connect = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI_LOCAL is not defined in environment variables");
    }

    const connectionOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority"
    };

    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log(colors.bg.blue + colors.fg.white + 'Connected to MongoDB successfully' + colors.reset);
  } catch (error) {
    console.error(colors.bg.red + 'MongoDB connection error:' + colors.reset, error.message);
    
    // إعادة المحاولة بعد 5 ثواني
    setTimeout(connect, 5000);
  }
};

// إدارة أحداث الاتصال
mongoose.connection.on('disconnected', () => {
  console.log(colors.bg.yellow + 'MongoDB disconnected! Reconnecting...' + colors.reset);
});

mongoose.connection.on('error', (err) => {
  console.error(colors.bg.red + 'MongoDB connection error:' + colors.reset, err);
});

// إعداد CORS للعمل مع Render
app.use(cors({
  origin: function (origin, callback) {
    // قائمة النطاقات المسموحة
    const allowedOrigins = [
      'http://localhost:5173',
      'https://your-frontend-app.onrender.com',
      'https://freelancing-app-nodejs.onrender.com',
      process.env.CLIENT_URL,
      process.env.RENDER_EXTERNAL_URL
    ].filter(Boolean);
    
    // السماح للطلبات بدون origin (مثل curl)
    if (!origin) return callback(null, true);
    
    // التحقق إذا كان النطاق مسموحاً
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie', 'Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposedHeaders: ['Set-Cookie', 'Cookie']
}));

// Middleware الأساسي
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/requests", requestRoute);
app.use("/api/projects", projectRoute);

// Health check endpoint لـ Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Everything is working correctly!" });
});

// Validate token endpoint
app.get("/api/auth/validate", (req, res) => {
  try {
    console.log('=== /api/auth/validate called ===');
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Request cookies:', req.cookies);
    console.log('Request IP:', req.ip);
    console.log('Request host:', req.get('host'));
    console.log('Request origin:', req.get('origin'));
    console.log('Request referer:', req.get('referer'));

    // طرق متعددة للحصول على التوكن
    let token = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;
    
    console.log('Cookie token exists:', !!token);
    console.log('Auth header exists:', !!authHeader);

    if (!token && authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Extracted token from Bearer header');
      } else {
        token = authHeader;
        console.log('Extracted token from plain auth header');
      }
    }

    if (!token) {
      console.log('❌ No token found in request');
      return res.status(401).json({ 
        success: false,
        message: "No authentication token found",
        details: {
          hasCookies: !!req.cookies,
          hasAuthHeader: !!req.headers.authorization,
          cookieKeys: req.cookies ? Object.keys(req.cookies) : []
        }
      });
    }

    console.log('Token found, verifying...');
    
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        console.log('Token content (first 50 chars):', token.substring(0, 50) + '...');
        
        return res.status(403).json({ 
          success: false,
          message: "Token verification failed",
          error: err.name,
          expired: err.name === "TokenExpiredError"
        });
      }

      console.log('✅ Token validated successfully for user:', payload.id);
      return res.status(200).json({
        success: true,
        valid: true,
        userId: payload.id,
        isSeller: payload.isSeller,
      });
    });
  } catch (err) {
    console.error('💥 Unexpected error in validate endpoint:', err);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: err.message 
    });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  
  console.error('Error:', err);
  
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// بدء التشغيل مع معالجة المنافذ لـ Render
const PORT = process.env.PORT || 8800;

const startServer = async () => {
  try {
    await connect();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(colors.fg.blue + title + colors.reset);
      console.log(colors.bg.blue + colors.fg.white + ' Backend server is running! ' + colors.reset);
      console.log(colors.fg.cyan + '➤ ' + colors.fg.yellow + 'Local: ' + colors.fg.green + `http://localhost:${PORT}` + colors.reset);
      
      if (process.env.RENDER_EXTERNAL_URL) {
        console.log(colors.fg.cyan + '➤ ' + colors.fg.yellow + 'External: ' + colors.fg.green + process.env.RENDER_EXTERNAL_URL + colors.reset);
      }
    });
  } catch (error) {
    console.error(colors.bg.red + 'Failed to start server:' + colors.reset, error);
    process.exit(1);
  }
};

startServer();

export default app;