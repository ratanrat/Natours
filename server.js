const mongose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// to know the envoirment of application
// console.log(app.get('env'));
// console.log(process.env);

// port
const port = 3000;
app.listen(port, () => {
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
