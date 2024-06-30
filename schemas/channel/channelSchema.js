import { gql } from 'apollo-server-express'

const channelSchema = gql`

    type Channel {
        id: ID!
        name: String!
        channelType: ChannelType!
        channelCategory: ChannelCategory!
        owner: User!
        description: String
    }

    type Query {
        channel(id: ID!): Channel
        channels: [Channel]
    }

    type Mutation {
        createChannel(name: String!, channelTypeId: ID!, channelCategoryId: ID!, ownerId: ID! ): Channel
    }
`;

export default channelSchema