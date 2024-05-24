import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
const userResolver = {
  Query: {
    users: async () => {
      try {
        const users = await User.find({});
        return users;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error getting users!");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found!");
        return user;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error getting the user!");
      }
    },
    authUser: async (_, __, context) => {
      try {
        const user = context.getUser();
        return user;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error getting the auth user!");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { userName, name, password, gender } = input;

        if (!userName || !name || !password || !gender)
          return new Error("All fields are required!");

        const user = await User.findOne({ userName });

        if (user) return new Error("Username already exist!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const newUser = new User({
          userName,
          name,
          password: hashedPassword,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
          gender: gender,
        });

        await newUser.save();
        await context.login(newUser);
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error while signup!");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { userName, password } = input;
        console.log("🚀 ~ login: ~ userName:", userName);
        console.log("🚀 ~ login: ~ password:", password);
        if (!userName || !password) return new Error("All fields are required");
        const { user } = await context.authenticate("graphql-local", {
          userName,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        console.error("Error: ", error.message);
        throw new Error("Error while trying to login!");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw new Error("Error: ", err.message);
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logout Successfully" };
      } catch (error) {
        console.error("Error: ", error.message);
        return { message: "Error while logout" };
      }
    },
  },
  User: {
    transactions: async (parent) => {
      try {
        const userId = parent._id;
        const transactions = await Transaction.find({ userId });

        return transactions;
      } catch (error) {
        console.error("Error: ", error.message);
      }
    },
  },
};

export default userResolver;
