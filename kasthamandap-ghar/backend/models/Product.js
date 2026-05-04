import { DataTypes } from 'sequelize';

const Product = (sequelize) => {
  return sequelize.define('Product', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    category: {
      type: DataTypes.ENUM('veg', 'non-veg', 'drinks', 'desserts', 'snacks', 'bar'),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'default.jpg'
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    preparationTime: {
      type: DataTypes.INTEGER,
      defaultValue: 20
    }
  }, {
    timestamps: true
  });
};

export default Product;