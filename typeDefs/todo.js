const { gql } = require("apollo-server-express");

module.exports = gql`
  type Todo {
    _id: ID!
    user: User!
    title: String!
    description: String!
    deadline: String
    status: String
    created_at: DataTime
    urgent: Boolean
    type: String
    priority: Int
    thematicPriority: Int
  }
  # input type
  input TodoCreateInput {
    title: String!
    description: String!
    deadline: String
    status: String
    urgent: Boolean
    type: String
    priority: Int
    thematicPriority: Int
  }
  # input type
  input TodoUpdateInput {
    _id: ID!
    title: String
    description: String
    deadline: String
    status: String
    urgent: Boolean
    type: String
    priority: Int
    thematicPriority: Int
  }
  # queries
  type Query {
    allTodos: [Todo!]!
  }
  # mutations
  type Mutation {
    todoCreate(input: TodoCreateInput!): Todo!
    todoUpdate(input: TodoUpdateInput!): Todo!
    todoDelete(todoId: String!): Todo!
    clearCompleted: [Todo]!
    toggleTodo(todoId: String!): Todo!
    toggleUrgent(todoId: String!): Todo!
  }
`;
