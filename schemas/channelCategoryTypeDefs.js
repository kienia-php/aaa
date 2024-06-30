import { gql } from 'apollo-server-express';

const channelCategoryTypeDefs = gql`
    type ChannelCategory {
        id: ID!
        slug: String!
        name: String!
        description: String
        categoryChannels: [Channel!]!
    }
    type Query {
        channelCategory(id: ID!): ChannelCategory
        channelsCategories: [ChannelCategory]
    }   
`

export default channelCategoryTypeDefs;