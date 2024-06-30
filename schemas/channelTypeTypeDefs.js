import { gql } from 'apollo-server-express';

const channelTypeTypeDefs = gql`
    type ChannelType {
        id: ID!
        slug: String!
        name: String!
        prompt: String!
        description: String
        channels: [Channel!]!
    }
    type Query {
        channelType(id: ID!): ChannelType
        channelsTypes: [ChannelType]
    }
`

export default channelTypeTypeDefs;