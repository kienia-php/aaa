import { DataTypes } from 'sequelize'
import sequelize from "../../config/db.js";

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'groups_categories',
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
    tableName: 'groups', // Явно указываем имя таблицы
});

export default Group