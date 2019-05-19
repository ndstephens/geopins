const { AuthenticationError, PubSub } = require('apollo-server')

//* a Higher-Order-Function that will wrap all resolver functions. Checks there is a verified user on context. If so, returns the resolver function it wrapped, otherwise throws an Error.
const authenticated = resolverFunc => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in')
  }
  return resolverFunc(root, args, ctx, info)
}

//* Subscription PubSub object
const pubsub = new PubSub()
const PIN_CREATED = 'PIN_CREATED'
const PIN_UPDATED = 'PIN_UPDATED'
const PIN_DELETED = 'PIN_DELETED'

module.exports = {
  //? QUERIES
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, { Pin }) => {
      return Pin.find({})
        .populate('author')
        .populate('comments.author')
    },
  },

  //? MUTATIONS
  Mutation: {
    //? CREATE PIN
    createPin: authenticated(async (root, { input }, { currentUser, Pin }) => {
      const newPin = await new Pin({
        ...input,
        author: currentUser._id,
      }).save()

      const createdPin = await Pin.populate(newPin, 'author')

      // publish and then return the created Pin
      pubsub.publish(PIN_CREATED, { pinCreatedSubscription: createdPin })
      // return createdPin
    }),
    //? UPDATE PIN (just the comment field)
    createComment: authenticated(
      async (root, { pinId, text }, { currentUser, Pin }) => {
        const newComment = {
          text,
          author: currentUser._id,
          createdAt: Date.now(),
        }
        const updatedPin = await Pin.findOneAndUpdate(
          { _id: pinId },
          { $push: { comments: newComment } },
          { new: true }
        )
          .populate('author')
          .populate('comments.author')

        // publish and then return the updated Pin
        pubsub.publish(PIN_UPDATED, {
          pinUpdatedSubscription: updatedPin,
        })
        // return updatedPin
      }
    ),
    //? DELETE PIN
    deletePin: authenticated(async (root, { pinId }, { currentUser, Pin }) => {
      const deletedPin = await Pin.findOneAndDelete({
        _id: pinId,
        author: currentUser._id,
      })

      // publish and then return the deleted Pin
      pubsub.publish(PIN_DELETED, { pinDeletedSubscription: deletedPin })
      // return deletedPin
    }),
  },

  //? SUBSCRIPTIONS
  Subscription: {
    pinCreatedSubscription: {
      subscribe: () => pubsub.asyncIterator(PIN_CREATED),
    },
    pinUpdatedSubscription: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED),
    },
    pinDeletedSubscription: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED),
    },
  },
}
