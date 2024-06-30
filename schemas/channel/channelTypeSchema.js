import { gql } from 'apollo-server-express';

const channelTypeSchema = gql`
    type ChannelType {
        id: ID!
        slug: String!
        name: String!
        icon: String!
        prompt: String!
        description: String
        typeChannels: [Channel!]!
    }
    type Query {
        channelType(id: ID!): ChannelType
        channelTypes: [ChannelType]
    }
`

export default channelTypeSchema;


