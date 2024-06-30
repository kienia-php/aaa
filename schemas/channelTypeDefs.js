import { gql } from 'apollo-server-express'

const channelTypeDefs = gql`

    type Channel {
        id: ID!
        name: String!
        channelCategory: ChannelCategory!
        owner: User!
        description: String
    }

    type Query { 
        channel(id: ID!): Channel
        channels: [Channel]        
    }

    type Mutation {
        createChannel(name: String!, categoryId: ID!, ownerId: ID! ): Channel
#        updateChannel(id: ID!, name: String, description: String, channelCategoryId: ID): Channel
#        deleteChannel(id: ID!): Boolean
    }
`;

export default channelTypeDefs