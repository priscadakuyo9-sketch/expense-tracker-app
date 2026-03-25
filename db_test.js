const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connection Successful! ✅');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Failed: ❌', err.message);
    process.exit(1);
  });
