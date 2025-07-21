import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to create task");
    }
  };

  const updateTask = async (id, taskData) => {
    try {
const updatedTask = await taskService.update(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.Id === id ? updatedTask : task));
      }
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || "Failed to update task");
    }
  };

  const toggleTaskComplete = async (id) => {
    try {
const updatedTask = await taskService.toggleComplete(id);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.Id === id ? updatedTask : task));
      }
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || "Failed to toggle task completion");
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: loadTasks,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask
  };
};