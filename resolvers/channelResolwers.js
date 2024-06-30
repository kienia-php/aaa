import Channel from '../models/Channel.js';
import ChannelCategory from '../models/ChannelCategory.js';
import ChannelType from "../models/ChannelType.js";
import User from '../models/User.js';

const channelResolvers = {
    Query: {
        channel: async (_, { id }) => {
            try {
                return await Channel.findByPk(id, {
                    include: [
                        // { model: User, as: 'owner' },
                        { model: ChannelCategory, as: 'channelCategory' },
                        // { model: ChannelType, as: 'type' }
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
                        // { model: ChannelCategory, as: 'category' },
                        // { model: ChannelType, as: 'type' },
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
        createChannel: async (_, { name, typeId, categoryId, ownerId }) => {
            try {
                const channel = await Channel.create({
                    name,
                    typeId,
                    categoryId,
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
        type: async (parent) => {
            try {
                return await ChannelType.findByPk(parent.typeId);
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching category for channel');
            }
        },
        category: async (parent) => {
            try {
                return await ChannelCategory.findByPk(parent.categoryId);
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching category for channel');
            }
        },
        owner: async (parent) => {
            try {
                return await User.findByPk(parent.ownerId);
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching owner for channel');
            }
        },
    },


};

export default channelResolvers;