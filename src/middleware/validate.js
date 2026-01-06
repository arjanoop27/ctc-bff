const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid request body',
      details: err.errors,
    });
  }
};

module.exports = validate;
