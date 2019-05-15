const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    me: User!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    pictureUrl: String
  }
`
