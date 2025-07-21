import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { isToday, isPast, format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";

import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

import { useFarms } from "@/hooks/useFarms";
import { useCrops } from "@/hooks/useCrops";
import { useTasks } from "@/hooks/useTasks";
import { useTransactions } from "@/hooks/useTransactions";
import { useWeather } from "@/hooks/useWeather";

const Dashboard = () => {
  const { onMenuClick } = useOutletContext();
  
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();
  const { crops, loading: cropsLoading, error: cropsError } = useCrops();
  const { tasks, loading: tasksLoading, error: tasksError, toggleTaskComplete } = useTasks();
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();

  const loading = farmsLoading || cropsLoading || tasksLoading || transactionsLoading;
  const error = farmsError || cropsError || tasksError || transactionsError;

  const handleToggleTask = async (taskId) => {
    try {
      await toggleTaskComplete(taskId);
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} />;

  // Calculate stats
  const activeCrops = crops.filter(crop => crop.status === "growing").length;
  const todayTasks = tasks.filter(task => !task.completed && isToday(new Date(task.dueDate))).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  ).length;

  // Calculate financial totals for current month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const monthlyTransactions = transactions.filter(t => 
    new Date(t.date) >= currentMonth
  );
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get upcoming tasks and recent transactions
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const getTaskPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "AlertCircle";
      case "medium": return "Clock";
      case "low": return "CheckCircle";
      default: return "Circle";
    }
  };

  const getTaskPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Farm Dashboard" 
        subtitle="Welcome back! Here's what's happening on your farms today"
        onMenuClick={onMenuClick}
        showMenu
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Farms"
            value={farms.length}
            icon="MapPin"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Growing Crops"
            value={activeCrops}
            icon="Sprout"
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            title="Today's Tasks"
            value={todayTasks}
            icon="CheckSquare"
            gradient="from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Monthly Net"
            value={`$${(monthlyIncome - monthlyExpenses).toLocaleString()}`}
            icon="DollarSign"
            gradient="from-primary-500 to-primary-600"
            trend={monthlyIncome > monthlyExpenses ? "up" : "down"}
            trendValue={`${((monthlyIncome - monthlyExpenses) / Math.max(monthlyExpenses, 1) * 100).toFixed(1)}%`}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Tasks */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Upcoming Tasks
                </h2>
                {overdueTasks > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <ApperIcon name="AlertCircle" className="w-5 h-5" />
                    <span className="text-sm font-medium">{overdueTasks} overdue</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">All caught up! No pending tasks.</p>
                  </div>
                ) : (
upcomingTasks.map((task, index) => {
                    const isOverdue = isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
                    const isTodayTask = isToday(new Date(task.dueDate));
                    
                    return (
                      <motion.div
                        key={task.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isOverdue ? "border-red-200 bg-red-50" :
                          isTodayTask ? "border-yellow-200 bg-yellow-50" :
                          "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isOverdue ? "bg-red-100 text-red-600" :
                            isTodayTask ? "bg-yellow-100 text-yellow-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            <ApperIcon 
                              name={getTaskPriorityIcon(task.priority)} 
                              className={`w-4 h-4 ${getTaskPriorityColor(task.priority)}`}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>{getFarmName(task.farmId)}</span>
                              <span>{format(new Date(task.dueDate), "MMM d")}</span>
                              <span className="capitalize">{task.priority} priority</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleTask(task.Id)}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <ApperIcon name="Check" className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Recent Transactions
                </h2>
                <div className="text-sm text-gray-600">
                  Last 5 transactions
                </div>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Receipt" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions yet.</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "expense" 
                            ? "bg-red-100 text-red-600" 
                            : "bg-green-100 text-green-600"
                        }`}>
                          <ApperIcon 
                            name={transaction.type === "expense" ? "ArrowDown" : "ArrowUp"} 
                            className="w-4 h-4" 
                          />
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description || `${transaction.category} ${transaction.type}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getFarmName(transaction.farmId)} • {format(new Date(transaction.date), "MMM d")}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`font-semibold ${
                        transaction.type === "expense" ? "text-red-600" : "text-green-600"
                      }`}>
                        {transaction.type === "expense" ? "-" : "+"}
                        ${transaction.amount.toLocaleString()}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Weather & Quick Stats */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <WeatherCard data={weather} />

            {/* Quick Farm Stats */}
            <Card>
              <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
                Quick Overview
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary-50">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Sprout" className="w-5 h-5 text-primary-600" />
                    <span className="text-primary-900">Crops Ready Soon</span>
                  </div>
                  <div className="font-semibold text-primary-900">
                    {crops.filter(crop => {
                      const daysUntilHarvest = differenceInDays(new Date(crop.expectedHarvestDate), new Date());
                      return daysUntilHarvest <= 7 && daysUntilHarvest > 0;
                    }).length}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="DollarSign" className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">Monthly Income</span>
                  </div>
                  <div className="font-semibold text-blue-900">
                    ${monthlyIncome.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="TrendingDown" className="w-5 h-5 text-red-600" />
                    <span className="text-red-900">Monthly Expenses</span>
                  </div>
                  <div className="font-semibold text-red-900">
                    ${monthlyExpenses.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Clock" className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-900">Pending Tasks</span>
                  </div>
                  <div className="font-semibold text-yellow-900">
                    {tasks.filter(task => !task.completed).length}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;