const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// KẾT NỐI MONGODB ATLAS
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ===============================
// MODEL STUDENT
// ===============================
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

// ===============================
// API HELLO
// ===============================
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend MERN đang hoạt động!",
  });
});

// ===============================
// CÂU 36 - GET
// Lấy danh sách sinh viên
// ===============================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách sinh viên",
      error: error.message,
    });
  }
});

// ===============================
// CÂU 37 - POST
// Thêm sinh viên
// ===============================
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = new Student({
      studentId,
      name,
      email,
    });

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Thêm sinh viên thất bại",
      error: error.message,
    });
  }
});

// ===============================
// CÂU 38 - PUT
// Cập nhật sinh viên
// ===============================
app.put("/api/students/:id", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId,
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.json(student);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cập nhật sinh viên thất bại",
      error: error.message,
    });
  }
});

// ===============================
// CÂU 39 - DELETE
// Xóa sinh viên
// ===============================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.json({
      message: "Xóa sinh viên thành công",
      student,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Xóa sinh viên thất bại",
      error: error.message,
    });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});