import { gql } from 'apollo-server-express'

const userTypeDefs = gql`
    scalar Upload

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        gender: String!
        phone: String! 
        emailVerified: Boolean!
        lastOnline: String
        avatar: Avatar
        channelsOwner: [Channel!]!
    }    

    type Query {
        me: User,
        user(id: ID!): User
    }

    type Avatar {
        tiny: String
        small: String
        medium: String
        large: String
        huge: String
    }

    type Mutation {
        register(firstName: String!, lastName: String!, gender: String!, phone: String!, password: String!): Boolean
        login(phone: String!, password: String!): AuthPayload
        verifyPhone(phone: String!, code: String!): AuthPayload
        changeEmail(newEmail: String!): Boolean
        logout: Boolean
        refreshToken(token: String!): AuthPayload
        updateUser(name: String, email: String): User
        uploadAvatar(file: Upload!): User! 
    }

    type AuthPayload {
        accessToken: String!
        refreshToken: String!
        user: User!
    }

    type UserStatus {
        id: ID!
        isOnline: Boolean!
        lastOnline: String
    }

    type Subscription {
        userStatusChanged: UserStatus
    }
    
    
`;

export default userTypeDefs