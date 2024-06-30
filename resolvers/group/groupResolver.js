import Group from "../../models/Group/Group.js";
import GroupCategory from "../../models/Group/GroupCategory.js";

const groupResolvers = {
    Query: {
        group: async (_, { id }) => {
            try {
                return await Group.findByPk(id, {
                    include: [
                        // { model: User, as: 'owner' },
                        { model: GroupCategory, as: 'groupCategory' },
                        // { model: ChannelType, as: 'type' }

                    ],
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel1');
            }
        },
        groups: async () => {
            try {
                return await Group.findAll({
                    include: [
                        { model: GroupCategory, as: 'groupCategory' },
                        // { model: ChannelType, as: 'type' },
                        // { model: User, as: 'owner' }
                    ]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels');
            }
        }
    },
    Mutation: {
        createGroup: async (_, { name, categoryId, description}) => {
            console.log(name, categoryId, description)
            try {


                const group = await Group.create({
                    name,
                    categoryId,
                    description
                });

                return group;
            } catch (error) {
                console.error(error);
                throw new Error('Error creating channel');
            }
        },
    },

    Group: {
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

export default groupResolvers;