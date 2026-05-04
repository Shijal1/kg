import { DataTypes } from 'sequelize';

const Payment = (sequelize) => {
  return sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    paymentMethod: {
      type: DataTypes.ENUM('qr', 'cash', 'card', 'digital_wallet'),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    qrScanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    transactionId: {
      type: DataTypes.STRING,
      unique: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true
  });
};

export default Payment;