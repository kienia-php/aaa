import ChannelCategory from '../models/ChannelCategory.js';
import Channel from '../models/Channel.js';

const channelCategoryResolvers = {
    Query: {
        channelCategory: async (_, { id }) => {
            try {
                return await ChannelCategory.findByPk(id, {
                    include: [{ model: Channel, as: 'channels' }]
                });
            } catch (error) {

                console.error(error);
                throw new Error('Error fetching channel category');
            }
        },
        channelsCategories: async () => {
            try {
                return await ChannelCategory.findAll({
                    include: [{ model: Channel, as: 'channels' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel categories');
            }
        }
    },
    ChannelCategory: {
        channels: async (parent) => {
            try {
                return await Channel.findAll({
                    where: { category: parent.id }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels for category');
            }
        }
    }
};


export default channelCategoryResolvers;