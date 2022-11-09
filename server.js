const mongose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// const ndb = require('ndb'); // for browser

process.on('uncaughtException', err => {
  console.log(
    ` uncaughtException err_name = ${err.name} and message = ${err.message}`
  );
  console.log(err);

  process.exit(1);
});

const app = require('./app');

// port
const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`app listenibg on port ${port}`);
});

//db connectivity

// LOCAL DB CONNECTING

// mongose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB connection successful!'));

// HOSTED DB CONNECTION
const dbstring = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongose
  .connect(dbstring, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful!');
  });

// to know the envoirment of application
console.log(`enviroment is ${app.get('env')}`);

// console.log(process.env);

// unhandlle rejection error

process.on('unhandledRejection', err => {
  console.log(
    `unhandledRejection errname=${err.name} and message = ${err.message}`
  );
  server.close(() => {
    process.exit(1);
  });
});
