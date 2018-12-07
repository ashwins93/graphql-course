import { GraphQLServer } from 'graphql-yoga'

// Demo user data
const users = [
  {
    id: 1,
    name: 'Ash',
    email: 'ash@ash.ash',
    age: 25,
  },
  {
    id: 2,
    name: 'Trevor',
    email: 'trevor@trevor.trevor',
    age: 37,
  },
  {
    id: 3,
    name: 'Lauren',
    email: 'lauren@lauren.lauren',
    age: 24,
  },
]

// Demo post data
const posts = [
  {
    id: 1,
    title: 'GraphQL is cool',
    body: 'Breakthrough in technology. GraphQL is the coolest.',
    published: false,
    author: 1,
  },
  {
    id: 2,
    title: 'Is REST dead?',
    body: 'The number  of services using REST API drops sharply.',
    published: false,
    author: 1,
  },
  {
    id: 1,
    title: 'React still popular',
    body:
      'After 5 years tech giant open sourced React.js a popular view library for building web applications, it remains the number one choice for developers.',
    published: false,
    author: 2,
  },
]

// Demo comments data
const comments = [
  {
    id: 2141,
    text: 'Lorem ipsum dolor sit amet.',
    author: 1,
    post: 1,
  },
  {
    id: 2135,
    text: 'Of course you are right. Amazing article.',
    author: 1,
    post: 2,
  },
  {
    id: 1241,
    text: "I can't wait for the GraphQL release.",
    author: 2,
    post: 2,
  },
  {
    id: 3233,
    text: 'Unbelievable. I totally missed it.',
    author: 3,
    post: 2,
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
