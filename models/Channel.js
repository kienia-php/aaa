import { DataTypes } from 'sequelize'
import sequelize from "../config/db.js"

const Channel = sequelize.define('Channel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'channels_categories',
            key: 'id'
        }
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50]
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },

},  {
    timestamps: true,
    tableName: 'channels', // Явно указываем имя таблицы
});

export default Channel