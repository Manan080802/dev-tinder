const parseToJson = (req, res, next) => {
  try {
    // Loop through every key in req.body
    for (const key in req.body) {
      if (
        typeof req.body[key] === "string" &&
        (req.body[key].startsWith("[") || req.body[key].startsWith("{"))
      ) {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `Invalid JSON format for field: ${key}`,
          });
        }
      }
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error parsing JSON fields",
    });
  }
};
module.exports = parseToJson;
