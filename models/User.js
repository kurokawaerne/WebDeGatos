const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.statics.register = async function ({ username, email, password }) {
  const admin = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase() === email.toLowerCase();
  return this.create({ username, email, role: admin ? 'admin' : 'user', password: await bcrypt.hash(password, 12) });
};

userSchema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: String(email).toLowerCase() }).select('+password');
  return user && (await bcrypt.compare(password, user.password)) ? user : null;
};

module.exports = mongoose.model('User', userSchema);
