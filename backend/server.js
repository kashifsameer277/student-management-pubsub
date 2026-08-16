const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

app.use(express.json());
console.log("Database configuration:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  hasPassword: Boolean(process.env.DB_PASSWORD),
});

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  connectTimeout: 5000,
});

const prisma = new PrismaClient({ adapter });

app.get("/", (req, res) => {
  res.json({
    message: "Student Management System Backend is Running",
  });
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();

    res.json(students);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch students",
    });
  }
});
app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      error: "Database connection failed",
    });
  }
});
app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});
// Add a new student
app.post("/api/students", async (req, res) => {
  try {
    const { name, rollNo } = req.body;

    if (!name || !rollNo) {
      return res.status(400).json({
        error: "Name and Roll Number are required",
      });
    }

    const student = await prisma.student.create({
      data: {
        name,
        rollNo,
      },
    });

    res.status(201).json(student);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to add student",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});