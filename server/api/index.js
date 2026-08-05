// Vercel's current Node.js Functions convention requires function entry
// files to live under api/. This just re-exports the real Express app
// from ../index.js so local dev (nodemon, pnpm dev) and the deployed
// function share exactly one source of truth.
module.exports = require('../index.js');
