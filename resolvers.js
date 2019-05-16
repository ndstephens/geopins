const { AuthenticationError } = require('apollo-server')

//* a Higher-Order-Function that will wrap all resolver functions. Checks there is a verified user on context. If so, returns the resolver function it wrapped, otherwise throws an Error.
const authenticated = resolverFunc => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in')
  }
  return resolverFunc(root, args, ctx, info)
}

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
  },
}
