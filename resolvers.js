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
    getPins: async (root, args, { Pin }) => {
      return Pin.find({})
        .populate('author')
        .populate('comments.author')
    },
  },
  Mutation: {
    createPin: authenticated(async (root, { input }, { currentUser, Pin }) => {
      const newPin = await new Pin({
        ...input,
        author: currentUser._id,
      }).save()

      return Pin.populate(newPin, 'author')
    }),
    deletePin: authenticated(async (root, { pinId }, { currentUser, Pin }) => {
      return Pin.findOneAndDelete({
        _id: pinId,
        author: currentUser._id,
      })
    }),
    createComment: authenticated(
      async (root, { pinId, text }, { currentUser, Pin }) => {
        const newComment = {
          text,
          author: currentUser._id,
          createdAt: Date.now(),
        }
        return Pin.findOneAndUpdate(
          { _id: pinId },
          { $push: { comments: newComment } },
          { new: true }
        )
          .populate('author')
          .populate('comments.author')
      }
    ),
  },
}
