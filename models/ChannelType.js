import {DataTypes} from "sequelize";
import sequelize from "../config/db.js";

const ChannelType = sequelize.define("ChannelType", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prompt:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'channels_types',
    timestamps: false,
    underscored: true
});

export default ChannelType