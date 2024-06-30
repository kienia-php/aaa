import userTypeDefs from './userTypeDefs.js';

import channelSchema from './channel/channelSchema.js';
import channelTypeSchema from "./channel/channelTypeSchema.js";
import channelCategorySchema from "./channel/channelCategorySchema.js";

import groupSchema from "./group/groupSchema.js";
import groupCategorySchema from "./group/groupCategotyShema.js";

const typeDefs = [userTypeDefs, channelSchema, channelTypeSchema, channelCategorySchema, groupSchema, groupCategorySchema];

export default typeDefs;