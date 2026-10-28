const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const useCloud = Boolean(process.env.CLOUDINARY_URL);
const cloudinary = useCloud ? require('cloudinary').v2 : null; // lee CLOUDINARY_URL solo
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

exports.saveImage = async (file) => {
  if (useCloud) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'webdegatos' }, (err, r) =>
          err ? reject(err) : resolve({ url: r.secure_url, publicId: r.public_id }))
        .end(file.buffer);
    });
  }
  const name = crypto.randomUUID() + EXT[file.mimetype];
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, name), file.buffer);
  return { url: '/uploads/' + name, publicId: null };
};

exports.deleteImage = async (photo) => {
  if (useCloud && photo.imagePublicId) await cloudinary.uploader.destroy(photo.imagePublicId);
  else if (photo.imageUrl.startsWith('/uploads/'))
    await fs.unlink(path.join(uploadsDir, path.basename(photo.imageUrl))).catch(() => {});
};
