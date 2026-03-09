import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const CartSchema = new Schema({
  owner: {type: String, required: true, default: "guest"},
  status: {type: Boolean, default: true},
  purchased: {type: Boolean, default: false},
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
      }, 
      quantity: {
        type: Number,
        default: 1,
        min: 1 
      }
    }
  ]
}, { timestamps: true });

CartSchema.plugin(mongoosePaginate);
export const CartModel = model('carts', CartSchema);