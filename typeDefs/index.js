import { mergeTypeDefs } from '@graphql-tools/merge'
import { transactionDefs } from './transaction.typeDef.js'
import { userDefs } from './user.typeDef.js'

const mergedTypeDefs = mergeTypeDefs([transactionDefs, userDefs])

export default mergedTypeDefs