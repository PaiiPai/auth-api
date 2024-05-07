const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const requireCookie = require("./middleware/requireCookie");
const secretRouter = require("./routes/secretRouter");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

const username = encodeURIComponent(process.env.DbUser); console.log(process.env.DbUser);
const password = encodeURIComponent(process.env.DbPassword);
const dbURI = `mongodb+srv://${username}:${password}@cluster0.cfktonb.mongodb.net/auth`;
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to database...");
    let port = process.env.PORT;
    let hostname = 'localhost';
    app.listen(port, err => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Server is running at http://${hostname}:${port}`);
      }
    });
  })
  .catch((err) => {
    console.log(`ERROR OCCURED: ${err}`);
  });

app.get('/', (req, res) => {
  res.render("./index", { title: 'Home' });
});

app.use(userRouter);

app.use(requireCookie, secretRouter);

// Cookies
app.get('/set-cookie', (req, res) => {
  res.cookie('newUser', false);

  res.cookie('newLogIn', true, { httpOnly: true, maxAge: 1000 * 60 * 60 * 12 });

  res.send('Cookies made');
});

app.get('/read-cookie', (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);

  res.json(cookies);
});