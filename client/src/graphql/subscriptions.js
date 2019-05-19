import gql from 'graphql-tag'

export const PIN_CREATED_SUBSCRIPTION = gql`
  subscription PIN_CREATED_SUBSCRIPTION {
    pinCreatedSubscription {
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
          name
          picture
        }
      }
    }
  }
`

export const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription PIN_UPDATED_SUBSCRIPTION {
    pinUpdatedSubscription {
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
          name
          picture
        }
      }
    }
  }
`

export const PIN_DELETED_SUBSCRIPTION = gql`
  subscription PIN_DELETED_SUBSCRIPTION {
    pinDeletedSubscription {
      _id
      image
    }
  }
`
