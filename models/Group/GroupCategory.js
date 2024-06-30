import { DataTypes } from 'sequelize'
import sequelize from "../../config/db.js";

const GroupCategory = sequelize.define("GroupCategory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'groups_categories',
    timestamps: false,
    underscored: true
});

export default GroupCategory