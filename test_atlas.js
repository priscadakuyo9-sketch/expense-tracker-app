const mongoose = require('mongoose');
const password = "Budget2026";
const uri = `mongodb+srv://DAKUYO:${password}@cluster0.gnvkcuq.mongodb.net/expense-tracker?retryWrites=true&w=majority`;

console.log('Testing connection to Atlas with Budget2026...');
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
