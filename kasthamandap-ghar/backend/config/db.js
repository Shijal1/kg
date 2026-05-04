import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from '../models/User.js';
import ProductModel from '../models/Product.js';
import OrderModel from '../models/Order.js';
import BookingModel from '../models/Booking.js';
import PaymentModel from '../models/Payment.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialize models
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const Booking = BookingModel(sequelize);
const Payment = PaymentModel(sequelize);

// Define relationships
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Order.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking', allowNull: true });
Booking.hasMany(Order, { foreignKey: 'bookingId', as: 'orders' });

// Add comparePassword method to User instance
User.prototype.comparePassword = async function(candidatePassword) {
  const bcrypt = (await import('bcryptjs')).default;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const db = {
  sequelize,
  User,
  Product,
  Order,
  Booking,
  Payment
};

export default db;
