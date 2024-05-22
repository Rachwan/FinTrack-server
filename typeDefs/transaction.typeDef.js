export const transactionDefs = `#graphql
  # Types
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
  }

  # Query And Mutation
  type Query {
    transactions: [Transaction!]
    transaction(transactionId: ID!): Transaction
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Transaction
  }

  input CreateTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
  }

  input UpdateTransactionInput {
    transactionId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    location: String
    date: String
  }
`