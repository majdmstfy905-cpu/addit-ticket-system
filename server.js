// Addit Ticket Management System - Complete Backend
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "addit_super_secret_key_2025";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// PostgreSQL Database Setup (for Render.com)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: "./database.sqlite",
      logging: false,
    });
// User Model
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.STRING,
    defaultValue: "employee",
    validate: { isIn: [["admin", "team_leader", "employee", "client"]] },
  },
  phone: DataTypes.STRING,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login: DataTypes.DATE,
});

// Ticket Model
const Ticket = sequelize.define("Ticket", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING,
    defaultValue: "open",
    validate: { isIn: [["open", "in_progress", "resolved", "closed"]] },
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: "medium",
    validate: { isIn: [["low", "medium", "high", "urgent"]] },
  },
  category: DataTypes.STRING,
  assigned_to: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  resolved_at: DataTypes.DATE,
  closed_at: DataTypes.DATE,
});

// JWT Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "لا يوجد رمز مصادقة" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "المستخدم غير موجود أو غير نشط" });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "رمز غير صالح" });
  }
};

// ==================== API ROUTES ====================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Addit Server is running",
    timestamp: new Date(),
  });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "الرجاء إدخال اسم المستخدم وكلمة المرور",
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    if (!user.is_active) {
      return res
        .status(403)
        .json({ success: false, message: "هذا الحساب غير نشط" });
    }

    await user.update({ last_login: new Date() });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// Get Current User
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Get All Tickets
app.get("/api/tickets", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// Create Ticket
app.post("/api/tickets", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || "medium",
      category,
      created_by: req.userId,
      status: "open",
    });

    res
      .status(201)
      .json({ success: true, message: "تم إنشاء التذكرة بنجاح", ticket });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// Update Ticket
app.put("/api/tickets/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "التذكرة غير موجودة" });
    }

    await ticket.update(req.body);
    res.json({ success: true, message: "تم تحديث التذكرة بنجاح", ticket });
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// Get Dashboard Stats
app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    const totalTickets = await Ticket.count();
    const openTickets = await Ticket.count({ where: { status: "open" } });
    const inProgressTickets = await Ticket.count({
      where: { status: "in_progress" },
    });
    const closedTickets = await Ticket.count({ where: { status: "closed" } });

    res.json({
      success: true,
      stats: {
        totalTickets,
        openTickets,
        inProgressTickets,
        closedTickets,
        responseRate:
          totalTickets > 0
            ? Math.round((closedTickets / totalTickets) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

// ==================== DATABASE INITIALIZATION ====================

// Define Associations
User.hasMany(Ticket, { foreignKey: "created_by", as: "createdTickets" });
User.hasMany(Ticket, { foreignKey: "assigned_to", as: "assignedTickets" });
Ticket.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Ticket.belongsTo(User, { foreignKey: "assigned_to", as: "assignee" });

// Initialize Database
const initDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected successfully");

    // Check if users exist
    const userCount = await User.count();

    if (userCount === 0) {
      // Create demo users
      const demoUsers = [
        {
          username: "admin",
          email: "admin@addit.com",
          password: await bcrypt.hash("admin123", 10),
          full_name: "محمد أحمد",
          role: "admin",
          phone: "+966501234567",
          is_active: true,
        },
        {
          username: "teamlead",
          email: "teamlead@addit.com",
          password: await bcrypt.hash("teamlead123", 10),
          full_name: "سارة علي",
          role: "team_leader",
          phone: "+966502345678",
          is_active: true,
        },
        {
          username: "employee",
          email: "employee@addit.com",
          password: await bcrypt.hash("employee123", 10),
          full_name: "علي حسن",
          role: "employee",
          phone: "+966503456789",
          is_active: true,
        },
      ];

      await User.bulkCreate(demoUsers);

      console.log("✅ Database seeded with demo users");
      console.log("👤 Demo accounts:");
      console.log("  - Admin: admin / admin123");
      console.log("  - Team Lead: teamlead / teamlead123");
      console.log("  - Employee: employee / employee123");

      // Create demo tickets
      const adminUser = await User.findOne({ where: { username: "admin" } });
      const demoTickets = [
        {
          title: "مشكلة في تسجيل الدخول",
          description: "لا أستطيع تسجيل الدخول إلى النظام",
          status: "open",
          priority: "high",
          category: "Technical",
          created_by: adminUser.id,
        },
        {
          title: "طلب تحديث البيانات",
          description: "أريد تحديث بياناتي الشخصية",
          status: "in_progress",
          priority: "medium",
          category: "General",
          created_by: adminUser.id,
        },
        {
          title: "استفسار عن الخدمات",
          description: "أريد معرفة المزيد عن الخدمات المتاحة",
          status: "resolved",
          priority: "low",
          category: "Inquiry",
          created_by: adminUser.id,
          resolved_at: new Date(),
        },
      ];

      await Ticket.bulkCreate(demoTickets);
      console.log("✅ Database seeded with demo tickets");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Addit Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}/login.html`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
      console.log(`💾 Database: SQLite (database.sqlite)`);
    });
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
};

initDatabase();

module.exports = app;
