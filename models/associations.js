
const defineAssociations = (User, Channel, ChannelType, ChannelCategory, Group, GroupCategory) => {



    // Определение связи "один-ко-многим" с Channel
    User.hasMany(Channel, {
        foreignKey: 'ownerId',
        as: 'channelsOwner'
    });

    // ChannelType.hasMany(Channel, {
    //     foreignKey: 'typeId',
    //     as: 'channels'
    // });



    //КАНАЛЫ
    // Определение связи "один-ко-многим" с Channel
    ChannelType.hasMany(Channel, {
        foreignKey: 'channelTypeId',
        as: 'typeChannels'
    });

    // Определение связи "многие-к-одному" с ChannelCategory
    Channel.belongsTo(ChannelType, {
        foreignKey: 'channelTypeId',
        as: 'channelType'
    });

    // Определение связи "один-ко-многим" с Channel
    ChannelCategory.hasMany(Channel, {
        foreignKey: 'channelCategoryId',
        as: 'categoryChannels'
    });

    // Определение связи "многие-к-одному" с ChannelCategory
    Channel.belongsTo(ChannelCategory, {
        foreignKey: 'channelCategoryId',
        as: 'channelCategory'
    });


    //ГРУППЫ
    GroupCategory.hasMany(Group, {
        foreignKey: 'categoryId',
        as: 'categoryGroups'
    });

    // Определение связи "многие-к-одному" с ChannelCategory
    Group.belongsTo(GroupCategory, {
        foreignKey: 'categoryId',
        as: 'groupCategory'
    });













    // Определение связи "многие-к-одному" с USER
    Channel.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

    // // Определение связи "многие-к-одному" с ChannelType
    // Channel.belongsTo(ChannelType, {
    //     foreignKey: 'typeId',
    //     as: 'type'
    // });
};

export default defineAssociations;