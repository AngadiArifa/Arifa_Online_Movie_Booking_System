require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "arifa_movie_booking",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({status:"ok", database:"connected"}); }
  catch { res.status(503).json({status:"error", message:"Check MySQL and .env settings."}); }
});

app.get("/api/movies", async (_req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM movies ORDER BY movie_id DESC"); res.json(rows); }
  catch { res.status(500).json({message:"Could not load movies."}); }
});

app.get("/api/shows", async (req, res) => {
  try {
    let sql = `SELECT s.show_id,s.movie_id,m.title,m.genre,m.language,s.theatre_name,
      s.show_date,s.show_time,s.ticket_price FROM shows s JOIN movies m ON m.movie_id=s.movie_id`;
    const params = [];
    if (req.query.movie_id) { sql += " WHERE s.movie_id=?"; params.push(req.query.movie_id); }
    sql += " ORDER BY s.show_date,s.show_time";
    const [rows] = await pool.query(sql, params); res.json(rows);
  } catch { res.status(500).json({message:"Could not load showtimes."}); }
});

app.post("/api/bookings", async (req, res) => {
  const {full_name,email,phone,show_id,seats} = req.body;
  const count = Number(seats);
  if (!full_name || !email || !show_id || !Number.isInteger(count) || count < 1 || count > 10)
    return res.status(400).json({message:"Enter your name, valid email, show and 1–10 tickets."});
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const [showRows] = await conn.query("SELECT ticket_price FROM shows WHERE show_id=? FOR UPDATE",[show_id]);
    if (!showRows.length) { await conn.rollback(); return res.status(404).json({message:"Show not found."}); }
    const [users] = await conn.query("SELECT user_id FROM users WHERE email=?",[email]);
    let userId;
    if (users.length) {
      userId = users[0].user_id;
      await conn.query("UPDATE users SET full_name=?,phone=? WHERE user_id=?",[full_name,phone || null,userId]);
    } else {
      const [u] = await conn.query("INSERT INTO users(full_name,email,phone) VALUES(?,?,?)",[full_name,email,phone || null]);
      userId = u.insertId;
    }
    const total = Number(showRows[0].ticket_price) * count;
    const [b] = await conn.query(
      "INSERT INTO bookings(user_id,show_id,seats,total_amount,booking_status) VALUES(?,?,?,?,'Confirmed')",
      [userId,show_id,count,total]);
    await conn.commit();
    res.status(201).json({message:"Booking confirmed!",booking_id:b.insertId,total_amount:total});
  } catch (e) {
    if (conn) await conn.rollback();
    console.error(e); res.status(500).json({message:"Booking failed. Check database setup."});
  } finally { if (conn) conn.release(); }
});

app.get("/api/bookings", async (_req,res) => {
  try {
    const [rows] = await pool.query(`SELECT b.booking_id,u.full_name,u.email,m.title,s.theatre_name,
      s.show_date,s.show_time,b.seats,b.total_amount,b.booking_status
      FROM bookings b JOIN users u ON u.user_id=b.user_id
      JOIN shows s ON s.show_id=b.show_id JOIN movies m ON m.movie_id=s.movie_id
      ORDER BY b.booking_id DESC`);
    res.json(rows);
  } catch { res.status(500).json({message:"Could not load bookings."}); }
});

app.get("*", (_req,res) => res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT, () => console.log(`Arifa's Movie Booking System: http://localhost:${PORT}`));
