import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg', 'drinks', 'desserts','snacks','bar']
  },
  image: {
    type: String,
    default: 'default.jpg'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  preparationTime: {
    type: Number,
    default: 20
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;