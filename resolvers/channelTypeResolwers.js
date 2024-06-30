import ChannelType from '../models/ChannelType.js';
import Channel from '../models/Channel.js';

const channelTypeResolvers = {
    Query: {
        channelType: async (_, { id }) => {
            try {
                return await ChannelType.findByPk(id, {
                    include: [{ model: Channel, as: 'channels' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel category');
            }
        },
        channelsTypes: async () => {
            try {
                return await ChannelType.findAll({
                    include: [{ model: Channel, as: 'channels' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel categories');
            }
        }
    },
    ChannelType: {
        channels: async (parent) => {
            try {
                return await Channel.findAll({
                    where: { type: parent.id }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels for category');
            }
        }
    }
};


export default channelTypeResolvers;