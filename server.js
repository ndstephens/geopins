require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const { findOrCreateUser } = require('./controllers/userController')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null
    let currentUser = null
    try {
      authToken = req.headers.authorization
      if (authToken) {
        // find user in db or create a new one
        currentUser = await findOrCreateUser(authToken)
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`)
    }
    return { currentUser }
  },
})

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected...'))
  .catch(err => console.error(err))

server.listen().then(({ url }) => console.log(`Server listening at ${url}`))
