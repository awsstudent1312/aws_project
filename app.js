const express = require("express");

const https = require("https");
const fs = require("fs");

const bodyParser = require("body-parser");
const consolidate = require("consolidate");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const signinRouter = require("./routes/signin");
const messagesRouter = require("./routes/messages");
const postRouter = require("./routes/post");
const logoutRouter = require("./routes/logout");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/pub", express.static("./pub"));

app.engine("html", consolidate.nunjucks);
app.set("view engine", "nunjucks");

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signin", signinRouter);
app.use("/messages", messagesRouter);
app.use("/post", postRouter);
app.use("/logout", logoutRouter);

//const options = {
//  key: fs.readFileSync("./keys/key.pem"),
//  cert: fs.readFileSync("./keys/cert.pem"),
//};

//https.createServer(options, app).listen(3443, () => {
//  console.log("you used htpps XD!!");
//});

app.listen(3000);
