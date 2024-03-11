const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "E-mail is required"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Enter a valid password"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Minimum length is 6 characters."],
  },
  retypePw: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return this.password === val; // Ensure password and retypePw match
      },
      message: "Passwords do not match",
    },
  },
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const pwCheck = await bcrypt.compare(password, user.password);
    if (pwCheck) {
      return user;
    }

    throw new Error("Password is incorrect");
  }
  throw new Error("User not found");
};

userSchema.pre("save" /* need to define method */, async function (next) {
  try {
    if (this.password !== this.retypePw) {
      throw new Error(
        "Passwords do not match"
      ); /* intentionally throwing error */
    }
    const hashRounds = 10;
    this.password = await bcrypt.hash(this.password, hashRounds);
    next();
  } catch (err) {
    return next(err);
  }
});

const User = model("user", userSchema);

module.exports = User;
