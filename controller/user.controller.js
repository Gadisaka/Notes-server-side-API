import db from "../config/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const signup = async (req, res, next) => {
  const { email, password, username, phone, birthday_year } = req.body;
  try {
    const result = await db.query("select * from users where email=$1", [
      email,
    ]);
    if (result.rows.length > 0) {
      res.status(400).json({
        message: "Signup failed! User with this email already exists",
      });
      return;
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    if (!password || !email || !username || !phone || !birthday_year) {
      res.status(400).json({
        message: "Signup failed! All fields are required",
        status: "error",
      });
      return;
    }

    await db.query(
      "INSERT INTO users (email, password , username , phone , birthday_year) VALUES ($1, $2 , $3 , $4 , $5)",
      [email, hashedPassword, username, phone, birthday_year]
    );

    res
      .status(200)
      .json({ message: "User created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: "error" });
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("select * from users where email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      res.json({ message: "user doesnt exist", status: "error" });
      return;
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      res.json({ message: "incorrect email or password", status: "error" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2w",
    });

    res.set("Authorization", `Bearer ${token}`);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.production,
        sameSite: "strict",
      })
      .status(200)
      .json({
        messge: "logged in succsusfully",
        useInfo: user,
        token: token,
        status: "success",
      });
  } catch (error) {
    next(error);
  }
};

export const user = async (req, res, next) => {
  const { id } = req.user;
  try {
    const result = await db.query("select * from users where id=$1", [id]);
    const user = result.rows[0];

    if (!user) {
      res.json("user doesnt exist");
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const userupdate = async (req, res, next) => {
  const { id } = req.params;
  const { email, password, username, phone, birthday_year } = req.body;
  try {
    const result = await db.query("select * from users where id=$1", [id]);
    const user = result.rows[0];

    if (!user) {
      res.json("user doesnt exist");
      return;
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcryptjs.hash(password, 10);
    }

    const updateData = await db.query(
      "update users set email = $1 , password = $2, username = $3, phone = $4, birthday_year = $5 WHERE id = $6",
      [
        email || user.email,
        hashedPassword,
        username || user.username,
        phone || user.phone,
        birthday_year || user.birthday_year,
        id,
      ]
    );
    const userUpdated = updateData.rows[0];
    res.json({
      userUpdated,
      message: "user update successfull!",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "user logged out", status: "success" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await db.query("select * from users");
    const user = result.rows;

    if (!user) {
      res.json("user doesnt exist");
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const isUserAutenticated = async (req, res, next) => {
  const { id } = req.body;
  try {
    if (!(req.user.id === id)) {
      res.json({ userAutenticated: false });
    }
    res.json({ userAutenticated: true });
  } catch (error) {
    next(error);
  }
};
