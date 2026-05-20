// query controllers
import { Todo } from "../../models/Todo";

export const resolvers = {
  Query: {
    todos: async () => await Todo.find(),
    todoSearch: async (_: any, { id }: { id: string }) =>
      await Todo.findById(id),
  },

  Mutation: {
    createTodo: async (_: any, { title }: { title: string }) => {
      const todo = new Todo({ title, completed: false });
      return await todo.save();
    },
    updateTodo: async (
      _: any,
      { id, completed }: { id: string; completed: boolean },
    ) => await Todo.findByIdAndUpdate(id, { completed }, { new: true }),
    deleteTodo: async (_: any, { id }: { id: string }) =>
      await Todo.findByIdAndDelete(id),
  },
};
