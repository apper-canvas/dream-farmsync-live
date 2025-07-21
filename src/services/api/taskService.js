import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

export const taskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tasks.find(task => task.Id === id);
  },

  async getByFarmId(farmId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tasks.filter(task => task.farmId === farmId);
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      ...taskData,
      completed: false
    };
    tasks.push(newTask);
    return newTask;
  },

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(task => task.Id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return tasks[index];
    }
    throw new Error("Task not found");
  },

  async toggleComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = tasks.findIndex(task => task.Id === id);
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      return tasks[index];
    }
    throw new Error("Task not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = tasks.findIndex(task => task.Id === id);
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Task not found");
  }
};