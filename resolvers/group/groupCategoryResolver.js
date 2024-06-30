import Group from "../../models/Group/Group.js";
import GroupCategory from "../../models/Group/GroupCategory.js";

const groupCategoryResolvers = {
    Query: {
        groupCategory: async (_, { id }) => {
            try {
                return await GroupCategory.findByPk(id, {
                    include: [{ model: Group, as: 'categoryGroups' }]
                });
            } catch (error) {

                console.error(error);
                throw new Error('Error fetching group category');
            }
        },
        groupCategories: async () => {
            try {
                return await GroupCategory.findAll({
                    include: [{ model: Group, as: 'categoryGroups' }]
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channel categories');
            }
        }
    },
    GroupCategory: {
        categoryGroups: async (parent) => {
            try {
                return await Group.findAll({
                    where: { categoryGroups: parent.id }
                });
            } catch (error) {
                console.error(error);
                throw new Error('Error fetching channels for category');
            }
        }
    }
};


export default groupCategoryResolvers;