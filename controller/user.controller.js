import db from "../config/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const signup = async (req, res, next) => {
  console.log("gzac");
  const { email, password, username, phone, birthday_year } = req.body;
  try {
    const result = await db.query("select * from users where email=$1", [
      email,
    ]);
    if (result.rows.length > 0) {
      res.json("signup failed user already exists");
      return;
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    if (!password || !email || !username || !phone || !birthday_year) {
      res.json("signup failed all filds are required");
      return;
    }

    const newUser = db.query(
      "INSERT INTO users (email, password , username , phone , birthday_year) VALUES ($1, $2 , $3 , $4 , $5) RETURNING *",
      [email, hashedPassword, username, phone, birthday_year]
    );
    if (newUser) {
      res.json("user created succsusfully");
    }
  } catch (error) {
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
      res.json("user doesnt exist");
      return;
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      res.json("incorrect email or password");
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.set("Authorization", `Bearer ${token}`);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.production,
        sameSite: "strict",
      })
      .json({ messge: "logged in succsusfully", useInfo: user })
      .status(200);
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
      "update users set email = $1 , password = $2, username = $3, phone = $4, birthday_year = $5 WHERE id = $6 returning* ",
      [
        email || user.email,
        hashedPassword,
        username || user.username,
        phone || user.phone,
        birthday_year || user.birthday_year,
        id,
      ]
    );
    res.json(updateData.rows[0]);
    console.log("user update successfull!");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json("user logged out");
  } catch (error) {
    next(error);
  }
};
