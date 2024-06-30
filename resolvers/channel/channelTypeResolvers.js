import Channel from "../../models/Channel/Channel.js";
import ChannelType from "../../models/Channel/ChannelType.js";

const channelTypeResolvers = {
    Query: {
        channelType: async (_, { id }) => {
            try {
                return await ChannelType.findByPk(id, {
                    include: [{ model: Channel, as: 'typeChannels' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching group category');
            }
        },
        channelTypes: async () => {
            try {
                return await ChannelType.findAll({
                    include: [{ model: Channel, as: 'typeChannels' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel categories');
            }
        }
    },
    ChannelType: {
        channelTypes: async (parent) => {
            try {
                return await Channel.findAll({
                    where: { typeChannels: parent.id }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels for category');
            }
        }
    }
};


export default channelTypeResolvers;