import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const User = (sequelize) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer'
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
};

export default User;