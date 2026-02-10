const { body } = require("express-validator");

const reservationValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").escape(),
  body("phone").trim().notEmpty().withMessage("Phone is required").escape(),
  body("date").trim().notEmpty().withMessage("Date is required").escape(),
  body("time").trim().notEmpty().withMessage("Time is required").escape(),
  body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
  body("special").optional().trim(),
  body("selectedTours")
    .isArray()
    .withMessage("Selected tours must be an array"),
];

module.exports = { reservationValidation };
