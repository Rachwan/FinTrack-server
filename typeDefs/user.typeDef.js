export const userDefs = `#graphql
  # Types
  type User {
    _id: ID!
    userName: String!
    name: String!
    password: String!
    profilePicture: String!
    gender: String!
  }

  # Query And Mutation
  type Query {
    users: [User!]
    authUser: User
    user(userId: ID!): User
  }

  type Mutation {
    signUp(input: SingUpInput!): User
    login(input: LogInInput!): User
    logout: LogoutResponse
  }

  input SingUpInput {
    userName: String!
    name: String!
    password: String!
    gender: String!
  }

input LogInInput {
  userName: String!
  password: String!
}

  type LogoutResponse {
    message: String!
  }
`;
