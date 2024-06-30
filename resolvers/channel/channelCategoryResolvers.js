import Channel from "../../models/Channel/Channel.js";
import ChannelCategory from "../../models/Channel/ChannelCategory.js";


const channelCategoryResolvers = {
    Query: {
        channelCategory: async (_, { id }) => {
            try {
                return await ChannelCategory.findByPk(id, {
                    include: [{ model: Channel, as: 'categoryChannels' }]
                });
            } catch (error) {

                console.error(error);
                throw new Error('Error fetching group category');
            }
        },
        channelCategories: async () => {
            try {
                return await ChannelCategory.findAll({
                    include: [{ model: Channel, as: 'categoryChannels' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel categories');
            }
        }
    },
    ChannelCategory: {
        categoryChannels: async (parent) => {
            try {
                return await Channel.findAll({
                    where: { categoryChannels: parent.id }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels for category');
            }
        }
    }
};


export default channelCategoryResolvers;