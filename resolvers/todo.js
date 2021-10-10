const { authCheck } = require("../helpers/authCheck");
const Todo = require("../models/todo");
const User = require("../models/user");

// Queries

const allTodos = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  return await Todo.find({ user: currentUserFromDb })
    .populate("user", "_id username")
    .sort({ createdAt: -1 });
};

// Mutations
const todoCreate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  // validation
  if (args.input.title.trim() === "") throw new Error("Title is required");

  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  });

  let newTodo = await new Todo({
    ...args.input,
    user: currentUserFromDb._id,
  })
    .save()
    .then((todo) => todo.populate("user", "_id username email").execPopulate());

  return newTodo;
};
const todoUpdate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);

  //  get current user mongodb _id based in email
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  // _id of todo to update
  const todoToUpdate = await Todo.findById({ _id: args.input._id }).exec();
  // if currentuser id and id of the todo's user id is same, allow update
  if (currentUserFromDb._id.toString() !== todoToUpdate.user._id.toString())
    throw new Error("Unauthorized action");
  let updatedTodo = await Todo.findByIdAndUpdate(
    args.input._id,
    { ...args.input },
    { new: true }
  )
    .exec()
    .then((todo) => todo.populate("user", "_id username").execPopulate());

  return updatedTodo;
};

const todoDelete = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  const todoToDelete = await Todo.findById({ _id: args.todoId }).exec();
  if (currentUserFromDb._id.toString() !== todoToDelete.user._id.toString())
    throw new Error("Unauthorized action");
  let deletedTodo = await Todo.findByIdAndDelete({ _id: args.todoId })
    .exec()
    .then((todo) => todo.populate("user", "_id username").execPopulate());

  return deletedTodo;
};

const clearCompleted = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  const clearedTodos = await Todo.find({
    status: "Finished",
    user: currentUserFromDb,
  }).exec();
  console.log(clearedTodos);

  const dix = await Todo.deleteMany({
    status: "Finished",
    user: currentUserFromDb,
  }).exec();

  console.log(clearedTodos);

  return clearedTodos;
};

const toggleTodo = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  const todoToTogle = await Todo.findById({ _id: args.todoId }).exec();
  if (currentUserFromDb._id.toString() !== todoToTogle.user._id.toString())
    throw new Error("Unauthorized action");
  let updatedTodo = await Todo.findByIdAndUpdate(
    args.todoId,
    { is_completed: !todoToTogle.is_completed },
    { new: true }
  ).exec();

  return updatedTodo;
};

const toggleUrgent = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();
  const todoToTogle = await Todo.findById({ _id: args.todoId }).exec();
  if (currentUserFromDb._id.toString() !== todoToTogle.user._id.toString())
    throw new Error("Unauthorized action");
  let updatedTodo = await Todo.findByIdAndUpdate(
    args.todoId,
    { urgent: !todoToTogle.urgent },
    { new: true }
  ).exec();

  return updatedTodo;
};

module.exports = {
  Query: {
    allTodos,
  },

  Mutation: {
    todoCreate,
    todoUpdate,
    todoDelete,
    clearCompleted,
    toggleTodo,
    toggleUrgent,
  },
};
