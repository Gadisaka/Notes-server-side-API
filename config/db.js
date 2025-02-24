import pg from "pg";
import env from "dotenv";
// import pkg from "pg";
const { Pool } = pg;

env.config();

// const db = new pg.Client({
//   user: process.env.USER,
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   password: process.env.PASSWORD,
//   port: process.env.PORT,
// });

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
const createTables = async () => {
  const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          username VARCHAR(100),
          phone VARCHAR(20),
          birthday_year INT
      );
  `;

  const notesTable = `
      CREATE TABLE IF NOT EXISTS notes (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          is_completed BOOLEAN DEFAULT FALSE
      );
  `;

  try {
    await db.query(usersTable);
    await db.query(notesTable);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    db.end();
  }
};

createTables();

export default db;
