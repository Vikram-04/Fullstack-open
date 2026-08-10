const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { required: true, type: String, unique: true, minLength: 3 },
    name: String,
    passwordHash: String,
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
      },
    },
  },
);

module.exports = mongoose.model("User", userSchema);
