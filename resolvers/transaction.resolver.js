import { transactions } from "../data/data.js";
import Transaction from "../models/transaction.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");

        const userId = context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error getting transactions!");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) throw new Error("Transaction not found!");
        return transaction;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error getting the transaction!");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error creating the transaction!");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          { ...input }
        );
        return updatedTransaction;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error updating the transaction!");
      }
    },
    deleteTransaction: async (_, { id }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        return deletedTransaction;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error deleting the transaction!");
      }
    },
  },
};

export default transactionResolver;
