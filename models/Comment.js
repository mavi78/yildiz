const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

module.exports = mongoose.model("Comment", commentSchema);
