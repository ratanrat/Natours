const express = require('express');
const appp = express();

// ROUTING

appp.get ('/', (req, res) => {
  // res.end('hiii from server ');
  res.json({ message: 'hiii from server ', app: 'natours' });
});

// port
const port = 3000;
appp.listen(port, () => {
  console.log(`app listenibg on port ${port}`);
});
