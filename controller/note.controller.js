import db from "../config/db.js";
import env from "dotenv";

env.config();

export const createNote = async (req, res, next) => {
  const { note } = req.body;
  const { id } = req.user;

  if (!note) {
    return res.status(400).json({ message: "Note content is required" });
  }

  try {
    const newNote = await db.query(
      "INSERT INTO notes(content, user_id) VALUES($1, $2) RETURNING content",
      [note, id]
    );
    res.json({ message: "Note created successfully", data: newNote.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const viewNote = async (req, res, next) => {
  const { id } = req.user;

  try {
    const result = await db.query(
      "select content from notes where user_id=$1",
      [id]
    );
    const notes = result.rows;
    if (!notes) {
      return res.json({ message: "There Are No notes Created By this User" });
    }
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const note_id = req.params.id;
  const user_id = req.user.id;

  try {
    await db.query("DELETE FROM notes WHERE id = $1 and user_id = $2", [
      note_id,
      user_id,
    ]);
    res.json({ message: "note deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateNote = async (req, res, next) => {
  const note_id = req.params.id;
  const user_id = req.user.id;
  console.log(note_id, user_id);

  try {
    const result = await db.query(
      "UPDATE notes SET is_completed = $1 WHERE id = $2 and user_id = $3 RETURNING*",
      [true, note_id, user_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

export const clearCompleted = async (req, res, next) => {
  const { id } = req.user;

  try {
    const result = await db.query(
      "SELECT * FROM notes WHERE user_id = $1 AND is_completed = $2",
      [id, true]
    );
    const completedNotes = result.rows;
    if (!completedNotes) return res.json({ message: "NO COMPLETED TASKS" });
    try {
      await db.query(
        "DELETE FROM notes WHERE user_id = $1 AND is_completed = $2",
        [id, true]
      );
      res.json({ message: "Completed Notes Cleared" });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
