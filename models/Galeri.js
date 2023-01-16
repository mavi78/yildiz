const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const galeriSchema = mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    tipi: {
      type: String,
      required: true,
    },
    comment: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

galeriSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

module.exports = mongoose.model("Galeri", galeriSchema);
