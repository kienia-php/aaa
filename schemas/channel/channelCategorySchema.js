import { gql } from 'apollo-server-express';

const channelCategorySchema = gql`
    type ChannelCategory {
        id: ID!
        slug: String!
        name: String!
        description: String
        categoryChannels: [Channel!]!
    }
    type Query {
        channelCategory(id: ID!): ChannelCategory
        channelCategories: [ChannelCategory]
    }
`

export default channelCategorySchema;


