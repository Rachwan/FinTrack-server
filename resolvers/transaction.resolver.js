import { transactions } from '../data/data.js'
const transactionResolver = {
  Query: {
    transactions() {
      return transactions
    },
    transaction(_, { transactionId }) {
      return transactions.find((transaction) => transaction._id === transactionId)
    }
  },
  Mutation: {
  }
}

export default transactionResolver;