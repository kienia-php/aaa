import { gql } from 'apollo-server-express';

const groupCategorySchema = gql`
    type GroupCategory {
        id: ID!
        slug: String!
        name: String!
        description: String
        categoryGroups: [Group!]!
    }
    type Query {
        groupCategory(id: ID!): GroupCategory
        groupCategories: [GroupCategory]
    }
`

export default groupCategorySchema;


