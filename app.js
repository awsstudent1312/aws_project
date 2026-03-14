const express = require('express');

const bodyParser = require('body-parser');
const consolidate = require('consolidate');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signinRouter = require('./routes/signin');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/pub', express.static('./pub'));

app.engine('html', consolidate.nunjucks);
app.set('view engine', 'nunjucks');

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signin', signinRouter);

app.listen(3000);
