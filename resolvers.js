const user = {
  _id: '1',
  name: 'Nate',
  email: 'nate@email.com',
  pictureUrl: 'https://cloudinary.com/123',
}

module.exports = {
  Query: {
    me: () => user,
  },
}
