require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected...'))
  .catch(err => console.error(err))

server.listen().then(({ url }) => console.log(`Server listening at ${url}`))
