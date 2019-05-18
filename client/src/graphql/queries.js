export const ME_QUERY = `
{
  me {
    _id
    name
    email
    picture
  }
}
`

export const GET_PINS = `
{
  getPins {
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
    comments {
      text
      createdAt
      author {
        _id
        name
        picture
      }
    }
  }
}
`
