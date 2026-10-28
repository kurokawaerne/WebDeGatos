const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  catName: { type: String, trim: true, maxlength: 40 },
  description: { type: String, trim: true, maxlength: 500 },
  imageUrl: { type: String, required: true },
  imagePublicId: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

photoSchema.statics.paginate = async function ({ q, page = 1, limit = 9, owner }) {
  const filter = {};
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { catName: rx }];
  }
  if (owner) filter.owner = owner;
  const [items, total] = await Promise.all([
    this.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit).populate('owner', 'username'),
    this.countDocuments(filter),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
};

const ownerId = (p) => String(p.owner._id || p.owner);
// Solo el dueño edita; el dueño o un admin pueden borrar
photoSchema.methods.canEdit = function (user) { return Boolean(user) && ownerId(this) === String(user.id); };
photoSchema.methods.canDelete = function (user) { return Boolean(user) && (user.role === 'admin' || this.canEdit(user)); };

module.exports = mongoose.model('Photo', photoSchema);
