import { DataTypes } from 'sequelize';

const Booking = (sequelize) => {
  return sequelize.define('Booking', {
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
    bookingType: {
      type: DataTypes.ENUM('dining', 'party', 'special'),
      allowNull: false,
      defaultValue: 'dining'
    },
    tableType: {
      type: DataTypes.ENUM('1-sitter', '2-sitter', '3-sitter', '4-sitter', 'family-pack', 'birthday-party', 'group-5-6'),
      allowNull: false
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    timeSlot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numberOfGuests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 20
      }
    },
    specialRequests: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending'
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'qr', 'card', 'digital_wallet'),
      defaultValue: 'cash'
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    depositAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    bookingNotes: {
      type: DataTypes.TEXT,
      defaultValue: ''
    }
  }, {
    timestamps: true
  });
};

export default Booking;