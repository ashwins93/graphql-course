import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import { arch } from 'os'

// Demo user data
const users = [
  {
    id: '1',
    name: 'Ash',
    email: 'ash@ash.ash',
    age: 25,
  },
  {
    id: '2',
    name: 'Trevor',
    email: 'trevor@trevor.trevor',
    age: 37,
  },
  {
    id: '3',
    name: 'Lauren',
    email: 'lauren@lauren.lauren',
    age: 24,
  },
]

// Demo post data
const posts = [
  {
    id: '1',
    title: 'GraphQL is cool',
    body: 'Breakthrough in technology. GraphQL is the coolest.',
    published: false,
    author: '1',
  },
  {
    id: '2',
    title: 'Is REST dead?',
    body: 'The number  of services using REST API drops sharply.',
    published: true,
    author: '1',
  },
  {
    id: '3',
    title: 'React still popular',
    body:
      'After 5 years tech giant open sourced React.js a popular view library for building web applications, it remains the number one choice for developers.',
    published: false,
    author: '2',
  },
]

// Demo comments data
const comments = [
  {
    id: '2141',
    text: 'Lorem ipsum dolor sit amet.',
    author: '1',
    post: '1',
  },
  {
    id: '2135',
    text: 'Of course you are right. Amazing article.',
    author: '1',
    post: '2',
  },
  {
    id: '1241',
    text: "I can't wait for the GraphQL release.",
    author: '2',
    post: '2',
  },
  {
    id: '3233',
    text: 'Unbelievable. I totally missed it.',
    author: '3',
    post: '2',
  },
]

// Type defs (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) return users

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return posts

      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        )
      })
    },
    me() {
      return {
        id: 'abc123',
        name: 'Ash',
        email: 'ash@b.com',
        age: 25,
      }
    },
    post() {
      return {
        id: 'aedfcb2131acb',
        title: 'GraphQL is cool',
        body: 'The best technology to master in 2018 is GraphQL. Lorem ipsum',
        published: true,
      }
    },
    comments() {
      return comments
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email)

      if (emailTaken) throw new Error('Email taken.')

      const newUser = {
        id: uuidv4(),
        ...args.data,
      }

      users.push(newUser)

      return newUser
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)

      if (!userExists) {
        throw new Error('User not found.')
      }

      const newPost = {
        id: uuidv4(),
        ...args.data,
      }

      posts.push(newPost)

      return newPost
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)

      if (!userExists) throw new Error('User not found')

      const postExistsAndPublished = posts.some(
        post => post.id === args.data.post && post.published
      )

      if (!postExistsAndPublished)
        throw new Error('Post does not exist or has not been published')

      const newComment = {
        id: uuidv4(),
        ...args.data,
      }

      comments.push(newComment)

      return newComment
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
    },
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('The server is up 🚀')
})
