import { motion } from "framer-motion";
import { format, isToday, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskBoard = ({ tasks, farms, onToggleComplete, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      watering: "Droplets",
      fertilizing: "Beaker",
      harvesting: "Scissors",
      planting: "Sprout",
      maintenance: "Wrench",
      monitoring: "Eye"
    };
    return iconMap[category.toLowerCase()] || "CheckSquare";
  };

  const getTaskStatus = (task) => {
    if (task.completed) return "completed";
    if (isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))) return "overdue";
    if (isToday(new Date(task.dueDate))) return "today";
    return "upcoming";
  };

  const groupedTasks = {
    overdue: tasks.filter(task => !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))),
    today: tasks.filter(task => !task.completed && isToday(new Date(task.dueDate))),
    upcoming: tasks.filter(task => !task.completed && !isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))),
    completed: tasks.filter(task => task.completed)
  };

  const TaskCard = ({ task }) => {
    const status = getTaskStatus(task);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className={cn(
          "transition-all duration-200",
          status === "completed" && "opacity-75 bg-gray-50",
          status === "overdue" && "border-red-200 bg-red-50",
          status === "today" && "border-yellow-200 bg-yellow-50"
        )}>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  task.completed 
                    ? "bg-green-100 text-green-600"
                    : "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                )}>
                  <ApperIcon name={getCategoryIcon(task.category)} className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h4 className={cn(
                    "font-semibold",
                    task.completed ? "text-gray-600 line-through" : "text-gray-900"
                  )}>
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {getFarmName(task.farmId)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleComplete(task.Id)}
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    task.completed 
                      ? "hover:bg-yellow-50 hover:text-yellow-600"
                      : "hover:bg-green-50 hover:text-green-600"
                  )}
                >
                  <ApperIcon 
                    name={task.completed ? "RotateCcw" : "Check"} 
                    className="w-4 h-4" 
                  />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Tag" className="w-4 h-4" />
                  <span className="capitalize">{task.category}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.Id)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 border-t pt-3">
                {task.description}
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  const Section = ({ title, tasks, icon, color = "gray" }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <ApperIcon name={icon} className={`w-5 h-5 text-${color}-600`} />
        <h3 className="text-lg font-display font-semibold text-gray-900">
          {title}
        </h3>
        <Badge variant="default" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.Id} task={task} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
      <Section
        title="Overdue"
        tasks={groupedTasks.overdue}
        icon="AlertCircle"
        color="red"
      />
      <Section
        title="Today"
        tasks={groupedTasks.today}
        icon="Clock"
        color="yellow"
      />
      <Section
        title="Upcoming"
        tasks={groupedTasks.upcoming}
        icon="Calendar"
        color="blue"
      />
      <Section
        title="Completed"
        tasks={groupedTasks.completed}
        icon="CheckCircle"
        color="green"
      />
    </div>
  );
};

export default TaskBoard;