const mongoose = require('mongoose')
const WishlistSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          }
        }
      ],
      modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
  );

module.exports = mongoose.model('Wishlist', WishlistSchema)