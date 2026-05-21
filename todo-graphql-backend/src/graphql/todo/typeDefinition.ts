// routes/router
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo] 
    getTodo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!): Todo
    updateTodo(id: ID!, completed: Boolean!): Todo
    deleteTodo(id: ID!): String
  }
`;
