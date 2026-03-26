const mongoose = require('mongoose');

const password = "Budget2026";
const uri = `mongodb+srv://DAKUYO:${password}@cluster0.gnvkcuq.mongodb.net/expense-tracker?retryWrites=true&w=majority`;

async function fixBudgetPeriods() {
  console.log('Connecting to Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected!');

  const db = mongoose.connection.db;

  // Current period: 2026-03
  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  console.log('Current period:', currentPeriod);

  // Find all budgets with period='MONTHLY' 
  const oldBudgets = await db.collection('budgets').find({ period: 'MONTHLY' }).toArray();
  console.log(`Found ${oldBudgets.length} budget(s) with period='MONTHLY'`);

  for (const budget of oldBudgets) {
    // Check if a budget for this user already exists for current month
    const existing = await db.collection('budgets').findOne({ 
      userId: budget.userId, 
      period: currentPeriod 
    });
    
    if (!existing) {
      // Update this budget's period to YYYY-MM
      await db.collection('budgets').updateOne(
        { _id: budget._id },
        { $set: { period: currentPeriod } }
      );
      console.log(`✅ Updated budget ${budget._id} — period: MONTHLY → ${currentPeriod}, limitAmount: ${budget.limitAmount || budget.amount}`);
    } else {
      console.log(`⏭️  User already has a budget for ${currentPeriod}, skipping MONTHLY budget ${budget._id}`);
    }
  }

  // Show final state
  const allBudgets = await db.collection('budgets').find({}).toArray();
  console.log('\n--- ALL BUDGETS AFTER FIX ---');
  for (const b of allBudgets) {
    console.log(`  userId: ${b.userId} | period: ${b.period} | limitAmount: ${b.limitAmount || b.amount}`);
  }

  console.log('\n✅ Fix complete!');
  await mongoose.disconnect();
  process.exit(0);
}

fixBudgetPeriods().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
