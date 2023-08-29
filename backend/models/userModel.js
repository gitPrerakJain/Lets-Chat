const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      // required: true,
      type: String,
      // default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
  {
    methods: {
      async matchPassword(currentpassword) {
        return await bcrypt.compare(currentpassword, this.password);
      },
    },
  }
);
userSchema.methods.matchPassword = async function (currentpassword) {
  return await bcrypt.compare(currentpassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  // const salt = await
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
