const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    ad: {
      type: String,
      required: [true, "Ad alanı zorunlu"],
      trim: true,
      text: true,
      min: 3,
      max: 30,
    },
    soyad: {
      type: String,
      required: [true, "Soyad alanı zorunlu"],
      trim: true,
      text: true,
      min: 2,
      max: 30,
    },
    email: {
      type: String,
      required: [true, "Email alanı zorunlu"],
      unique: [true, "Bu mail adresi kullanımda"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "şifre alanı zorunlu"],
      min: [6, "şifre minimum 6 karakter olmalı"],
    },
    resim: {
      type: String,
      trim: true,
      default: "noimg",
    },
    telefon: {
      type: String,
      default: null,
      trim: true,
      min: 11,
      max: 11,
    },
    onayli: {
      type: Boolean,
      default: false,
    },
    rol: {
      type: String,
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    like: [
      {
        type: ObjectId,
        ref: "Galeri",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
