import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ===============================
  // LẤY DANH SÁCH SINH VIÊN
  // ===============================
  const getStudents = async () => {
    try {
      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sinh viên");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("GET ERROR:", error);
      alert("Không thể tải danh sách sinh viên!");
    }
  };

  // ===============================
  // CHẠY KHI MỞ TRANG
  // ===============================
  useEffect(() => {
    getStudents();
  }, []);

  // ===============================
  // THÊM SINH VIÊN
  // ===============================
  const addStudent = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Thêm sinh viên thất bại");
      }

      alert("Thêm sinh viên thành công!");

      // Xóa nội dung form
      setStudentId("");
      setName("");
      setEmail("");

      // Tải lại danh sách
      getStudents();
    } catch (error) {
      console.error("POST ERROR:", error);

      alert("Thêm sinh viên thất bại!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Danh sách sinh viên
      </h1>

      {/* ===============================
          FORM THÊM SINH VIÊN
      =============================== */}

      <h2>Thêm sinh viên</h2>

      <form
        onSubmit={addStudent}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{
            padding: "10px",
            flex: "1",
            minWidth: "150px",
          }}
        />

        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            flex: "1",
            minWidth: "150px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            flex: "1",
            minWidth: "180px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Thêm sinh viên
        </button>
      </form>

      {/* ===============================
          DANH SÁCH SINH VIÊN
      =============================== */}

      <h2>Danh sách</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>STT</th>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>ID MongoDB</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>

                <td>{student.studentId}</td>

                <td>{student.name}</td>

                <td>{student.email}</td>

                <td>{student._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;