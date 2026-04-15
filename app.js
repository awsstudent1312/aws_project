require("dotenv").config();

const express = require("express");

const https = require("https");

const bodyParser = require("body-parser");
const consolidate = require("consolidate");
const { rateLimit } = require("express-rate-limit");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const signinRouter = require("./routes/signin");
const messagesRouter = require("./routes/messages");
const postRouter = require("./routes/post");
const logoutRouter = require("./routes/logout");

const app = express();

app.set("trust proxy", 1);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));

app.engine("html", consolidate.nunjucks);
app.set("view engine", "html");


const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "too many attempts, try again later" },
});

const signinLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "too many attempts, try again later" },
});

const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 messages max par minute
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "too many messages, slow down a bit" },
});

app.use("/", indexRouter);
app.use("/login", loginLimiter, loginRouter);
app.use("/signin", signinLimiter, signinRouter);
app.use("/messages", messagesRouter);
app.use("/post", postLimiter, postRouter);
app.use("/logout", logoutRouter);

// const options = {
//   key: process.env.PKEY,
//   cert: process.env.CERT,
// };

// https.createServer(options, app).listen(3443, () => {
//   console.log("you used htpps XD!!");
// });

// app.listen(3000);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
