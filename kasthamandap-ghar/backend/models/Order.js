import { DataTypes } from 'sequelize';

const Order = (sequelize) => {
  return sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of order items with product, name, quantity, price'
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Object with address and phone'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Cash on Delivery'
    },
    itemsPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    taxPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    shippingTracking: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Tracking status, estimated delivery, delivery person info, current location'
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });
};

export default Order;
