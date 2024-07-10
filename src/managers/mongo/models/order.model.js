import mongoose from 'mongoose';

const collection = 'Orders';

const schema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schema.pre(['find', 'findOne', 'findById'], function () {
  this.populate('products.product').populate('user');
});

const orderModel = mongoose.model(collection, schema);

export default orderModel;
