const mongoose = require('mongoose');

// MongoDB URI from .env
const MONGODB_URI = 'mongodb://localhost:27017/expense-tracker';

async function setup() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected ✅');

        // 1. Get the first user
        const UserSchema = new mongoose.Schema({ email: String, name: String });
        const User = mongoose.model('User', UserSchema);
        const user = await User.findOne();
        
        if (!user) {
            console.error('No user found in database! ❌');
            return;
        }
        console.log(`Found user: ${user.name} (${user._id})`);

        // 2. Create Budget for 2026-03
        const BudgetSchema = new mongoose.Schema({
            limitAmount: Number,
            amount: Number, // Legacy support
            period: String,
            alertThreshold: Number,
            userId: mongoose.Schema.Types.ObjectId
        }, { timestamps: true });
        
        const Budget = mongoose.model('Budget', BudgetSchema);
        
        const period = '2026-03';
        const limitAmount = 200000;
        const alertThreshold = 60; // 60%

        await Budget.findOneAndUpdate(
            { userId: user._id, period },
            { 
                limitAmount, 
                amount: limitAmount, 
                alertThreshold, 
                userId: user._id 
            },
            { upsert: true, new: true }
        );
        console.log(`Budget of ${limitAmount} set for ${period} (Threshold: ${alertThreshold}%) ✅`);

        // 3. Create a test expense to trigger the alert (exceeding 60% of 200,000 = 120,000)
        const ExpenseSchema = new mongoose.Schema({
            amount: Number,
            description: String,
            date: Date,
            userId: mongoose.Schema.Types.ObjectId,
            categoryId: mongoose.Schema.Types.ObjectId,
            paymentMethod: String
        }, { timestamps: true });

        const Expense = mongoose.model('Expense', ExpenseSchema);

        // Find a category first
        const Category = mongoose.model('Category', new mongoose.Schema({ name: String }));
        const category = await Category.findOne({ userId: user._id });

        if (!category) {
            console.warn('No category found, using a generic ID.');
        }

        const expenseAmount = 150000; // > 60% of 200,000
        await Expense.create({
            amount: expenseAmount,
            description: 'Test High Expense 🍔',
            date: new Date(),
            userId: user._id,
            categoryId: category ? category._id : new mongoose.Types.ObjectId(),
            paymentMethod: 'Mobile Money'
        });
        console.log(`Expense of ${expenseAmount} created to trigger alert! 🔔`);

        console.log('\n--- Setup Complete ---');
        console.log('Open your mobile app and pull to refresh! 🚀');

    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        await mongoose.disconnect();
    }
}

setup();
