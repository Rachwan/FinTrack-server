import { users } from '../data/data.js'
const userResolver = {
  Query: {
    users() {
      return users
    },
    user: (_parent, { userId }) => {
      return users.find((user) => user._id === userId)
    }
  },
  Mutation: {
  }
}

export default userResolver