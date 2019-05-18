export const CREATE_PIN = `
mutation CREATE_PIN($title: String!, $content: String!, $image: String!, $latitude: Float!, $longitude: Float!) {
  createPin(input: {
    title: $title,
    content: $content,
    image: $image,
    latitude: $latitude,
    longitude: $longitude
  }) {
    _id
    title
    content
    image
    latitude
    longitude
    createdAt
    author {
      _id
      name
      email
      picture
    }
  }
}
`

export const DELETE_PIN = `
mutation DELETE_PIN($pinId: ID!) {
  deletePin(pinId: $pinId) {
    _id
    image
  }
}
`
