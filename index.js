const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart()

const server = 'ds147723.mlab.com:47723';
const db = 'heroku_jnshm3fq';
const user = 'motivationdb';
const pass = 'motivationdb1';

mongoose.connect(`mongodb://${user}:${pass}@${server}/${db}`)

const app = express();

//let Person = require('./src/models/person.model')


//let bodyParser = require('body-parser')

const personRouter = require('./src/routes/person');
const motivationRouter = require('./src/routes/motivation');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

app.use('/person', personRouter);
app.use('/motivation', motivationRouter);

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));