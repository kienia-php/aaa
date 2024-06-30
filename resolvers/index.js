import userResolvers from './userResolwers.js';


import channelResolvers from './channel/channelResolvers.js';
import channelTypeResolvers from './channel/channelTypeResolvers.js';
import channelCategoryResolvers from "./channel/channelCategoryResolvers.js";


import groupResolvers from "./group/groupResolver.js"
import groupCategoryResolvers from "./group/groupCategoryResolver.js"


const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...channelResolvers.Query,
        ...channelTypeResolvers.Query,
        ...channelCategoryResolvers.Query,
        ...groupResolvers.Query,
        ...groupCategoryResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...channelResolvers.Mutation,
        ...groupResolvers.Mutation,
    },
};

export default resolvers;