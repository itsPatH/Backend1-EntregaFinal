import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'Products';

const thumbnailSchema = new mongoose.Schema({
  mimetype: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  main: {
    type: Boolean,
    required: true,
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [thumbnailSchema],
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
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


productSchema.plugin(mongoosePaginate);


productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const productModel = mongoose.model(collection, productSchema);

export default productModel;