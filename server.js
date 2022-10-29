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
