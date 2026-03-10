const express = require('express');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signinRouter = require('./routes/signin');

const app = express();

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signin', signinRouter);

app.listen(3000);
