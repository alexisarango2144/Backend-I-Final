import { Schema, model } from "mongoose";

const RatingSchema = new Schema({
  count: {type: Number},
  rate: {type: Number}
})

const ProductSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  code: {type: String},
  category: {type: String || Array, required: true},
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  thumbnails: {type: Array, required: true},
  price: {type: Number, required: true},
  rating: RatingSchema
});

export const ProductModel = model('products', ProductSchema);