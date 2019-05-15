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

  type Pin {
    _id: ID!
    title: String!
    content: String
    image: String
    latitude: Float!
    longitude: Float!
    author: User!
    comments: [Comment]
    createdAt: String!
  }

  type Comment {
    text: String!
    author: User!
    createdAt: String!
  }
`
