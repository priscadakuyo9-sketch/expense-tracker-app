const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const password = "Budget2026";
const uri = `mongodb+srv://DAKUYO:${password}@cluster0.gnvkcuq.mongodb.net/expense-tracker?retryWrites=true&w=majority`;

async function seedAtlas() {
  console.log('Connecting to Atlas for full seeding...');
  await mongoose.connect(uri);
  console.log('✅ Connected!');

  const db = mongoose.connection.db;
  
  // 1. Ensure User exists
  let user = await db.collection('users').findOne({ email: 'test@example.com' });
  if (!user) {
    console.log('Creating test@example.com user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const result = await db.collection('users').insertOne({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      currency: 'CFA',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user = { _id: result.insertedId };
    console.log('✅ User created!');
  }
  const userId = user._id;

  // 2. Ensure Categories exist
  let category = await db.collection('categories').findOne({ name: 'Alimentation' });
  if (!category) {
    console.log('Creating default category...');
    const result = await db.collection('categories').insertOne({
      name: 'Alimentation',
      icon: '🍔',
      type: 'EXPENSE',
      isDefault: true
    });
    category = { _id: result.insertedId };
    console.log('✅ Category created!');
  }
  const categoryId = category._id;

  // 3. Create Budget for current month
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  await db.collection('budgets').updateOne(
    { userId, period },
    { $set: { limitAmount: 200000, period, userId, alertThreshold: 80 } },
    { upsert: true }
  );
  console.log('✅ Budget updated for', period);

  // 4. Add a sample expense
  await db.collection('expenses').insertOne({
    amount: 125000,
    description: 'Courses et Loyeur',
    date: new Date(),
    userId,
    categoryId,
    paymentMethod: 'Mobile Money'
  });
  console.log('✅ Sample expense added (125,000 CFA)');

  console.log('--- SEEDING COMPLETE ---');
  process.exit(0);
}

seedAtlas().catch(err => {
  console.error(err);
  process.exit(1);
});
