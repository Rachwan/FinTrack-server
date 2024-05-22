import { users } from '../data/data.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
const userResolver = {
  Query: {
    users: async () => {
      try {
        const users = await User.find({})
        return users
      } catch (error) {
        console.error("Error: ", error.message)
        throw new Error("Error getting users!")
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId)
        if (!user) throw new Error("User not found!")
        return user;
      } catch (error) {
        console.error("Error: ", error.message)
        throw new Error("Error getting the user!")
      }
    },
    authUser: async (_, __, context) => {
      try {
        const user = context.getUser();
        return user
      } catch (error) {
        console.error("Error: ", error.message)
        throw new Error("Error getting the auth user!")
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { userName, name, password, gender } = input;
        if (!userName || !name || !password || !gender) throw new Error("All fields are required!");
        const user = await User.find({ userName })
        if (user) throw new Error("Username already exist!");

        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const newUser = new User({
          userName,
          name,
          password: hashedPassword,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
        })

        await newUser.save();
        await context.login(newUser)
      } catch (error) {
        console.error("Error: ", error.message)
        throw new Error("Error while signup!")
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { userName, password } = input;
        const { user } = await context.authenticate("graphql-local", { userName, password })
        await context.login(user)
        return user
      } catch (error) {
        console.error("Error: ", error.message)
        throw new Error("Error while login!")
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw new Error("Error: ", err.message)
        })
        res.clearCookie("connect.sid")
        return { message: "Logout Successfully" }
      } catch (error) {
        console.error("Error: ", error.message)
        throw new Error("Error while logout!")
      }
    }
  }
}

export default userResolver