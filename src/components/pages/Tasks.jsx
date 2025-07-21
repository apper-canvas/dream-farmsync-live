import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";

import Header from "@/components/organisms/Header";
import TaskBoard from "@/components/organisms/TaskBoard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

import { useTasks } from "@/hooks/useTasks";
import { useFarms } from "@/hooks/useFarms";

const Tasks = () => {
  const { onMenuClick } = useOutletContext();
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, toggleTaskComplete, deleteTask } = useTasks();
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    title: "",
    description: "",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    priority: "medium",
    category: "watering"
  });

  const loading = tasksLoading || farmsLoading;
  const error = tasksError || farmsError;

  const taskCategories = [
    { value: "watering", label: "Watering" },
    { value: "fertilizing", label: "Fertilizing" },
    { value: "harvesting", label: "Harvesting" },
    { value: "planting", label: "Planting" },
    { value: "maintenance", label: "Maintenance" },
    { value: "monitoring", label: "Monitoring" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      title: "",
      description: "",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      priority: "medium",
      category: "watering"
    });
    setShowAddForm(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId || !formData.title || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const taskData = {
        ...formData,
        farmId: parseInt(formData.farmId),
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (editingTask) {
        await updateTask(editingTask.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await createTask(taskData);
        toast.success("Task created successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId.toString(),
      title: task.title,
      description: task.description || "",
      dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
      priority: task.priority,
      category: task.category
    });
    setShowAddForm(true);
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskComplete(taskId);
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} />;

  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Task Management" 
        subtitle={`${pendingTasks} pending, ${completedTasks} completed tasks`}
        onMenuClick={onMenuClick}
        showMenu
        actions={
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        }
      />
      
      <div className="p-6 space-y-8">
        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h2>
                <Button variant="ghost" onClick={resetForm}>
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Farm *"
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm.Id} value={farm.Id}>
                        {farm.name}
                      </option>
                    ))}
                  </Select>
                  
                  <Input
                    label="Task Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Water corn crops"
                  />
                  
                  <Input
                    label="Due Date *"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                  
                  <Select
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </Select>
                  
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {taskCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
                    placeholder="Add any additional details about this task..."
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button type="submit">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {editingTask ? "Update Task" : "Add Task"}
                  </Button>
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Tasks Board */}
        {tasks.length === 0 ? (
          <Empty
            icon="CheckSquare"
            title="No tasks yet"
            message="Stay organized by creating your first farming task."
            actionLabel="Add Task"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <TaskBoard
            tasks={tasks}
            farms={farms}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;