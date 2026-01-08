const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const upload = require('../middleware/uploadJson');

const {
  importThemeFromJson,
  exportThemeAsJson,
  deleteCtcThemeHandler,
  getAllThemes,
} = require('../controllers/ctcTheme.controller');

const router = express.Router();

router.post(
  '/import',
  auth,
  adminOnly,
  upload.single('file'),
  importThemeFromJson,
);

router.get('/:id/export', auth, adminOnly, exportThemeAsJson);

router.delete('/:id', auth, adminOnly, deleteCtcThemeHandler);

router.get('/', auth, adminOnly, getAllThemes);

module.exports = router;
