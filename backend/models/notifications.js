const mongoose = require('mongoose')
const NotificationsSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      notifications: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "order"
            },
            oldStatus: String,
            newStatus: String,
            readStatus: Boolean
        }
      ],
      modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
  );

module.exports = mongoose.model('Notifications', NotificationsSchema)