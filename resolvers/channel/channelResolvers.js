import Channel from "../../models/Channel/Channel.js";
import ChannelType from "../../models/Channel/ChannelType.js";
import ChannelCategory from "../../models/Channel/ChannelCategory.js";
import User from "../../models/User.js";

const channelResolvers = {
    Query: {
        channel: async (_, { id }) => {
            try {
                return await Channel.findByPk(id, {
                    include: [
                        { model: ChannelType, as: 'channelType' },
                        { model: ChannelCategory, as: 'channelCategory' },
                        { model: User, as: 'owner' },
                    ],
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel1');
            }
        },
        channels: async () => {
            try {
                return await Channel.findAll({
                    include: [
                        { model: ChannelType, as: 'channelType' },
                        { model: ChannelCategory, as: 'channelCategory' },
                        { model: User, as: 'owner' }
                    ]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels');
            }
        }
    },
    Mutation: {
        createChannel: async (_, { name, channelTypeId, channelCategoryId, ownerId}) => {
            try {
                const channel = await Channel.create({
                    name,
                    channelTypeId,
                    channelCategoryId,
                    ownerId
                });
                return channel;
            } catch (error) {
                console.error(error);
                throw new Error('Error creating channel');
            }
        },
    },

    Channel: {
        category: async (parent) => {
            try {
                return await GroupCategory.findByPk(parent.categoryId);
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching category for channel');
            }
        },
    },

};

export default channelResolvers;