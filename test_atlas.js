const mongoose = require('mongoose');
const uri = "mongodb+srv://DAKUYO:BudgetWise2026@cluster0.gnvkcuq.mongodb.net/expense-tracker?retryWrites=true&w=majority";

console.log('Testing connection to Atlas...');
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
