const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017/expense-tracker';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    currency: { type: String, default: 'CFA' },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', UserSchema);

async function createTestUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB ✅');

        const email = 'test@example.com';
        const existing = await User.findOne({ email });
        
        if (existing) {
            console.log('Test user already exists.');
        } else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Test User',
                email: email,
                password: hashedPassword,
                currency: 'CFA',
                role: 'user'
            });
            console.log('Test user created: test@example.com / password123 ✅');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

createTestUser();
