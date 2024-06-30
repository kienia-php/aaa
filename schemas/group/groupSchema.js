import { gql } from 'apollo-server-express'

const groupSchema = gql`

    type Group {
        id: ID!
        name: String!
        groupCategory: GroupCategory!
        description: String
    }

    type Query {
        group(id: ID!): Group
        groups: [Group]
    }

    type Mutation {
        createGroup(name: String!, categoryId: ID!, description: String): Group
    }
`;

export default groupSchema