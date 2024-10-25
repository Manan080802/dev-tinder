if (process.version !== "v20.12.2") {
  console.log("Only use in v20.12.2");
  process.exit(1);
}
const dotenv = require("dotenv");
dotenv.config({});
const express = require("express");
const router = express();
const { dataBaseConnect } = require("./config/database");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const { errorConverter, errorHandler } = require("./middleware/error");
const cookieParser = require("cookie-parser");
router.use(express.json());
router.use(cookieParser());
router.use("/auth", require("./routes/auth"));
router.use("/user", require("./routes/user"));

router.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not Found"));
});
router.use(errorConverter);

router.use(errorHandler);

dataBaseConnect().then(() => {
  console.log("Database is connected.");
  router.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
  });
});
