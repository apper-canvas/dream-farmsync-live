import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TransactionList = ({ transactions, farms, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      seeds: "Sprout",
      fertilizer: "Beaker",
      equipment: "Wrench",
      fuel: "Fuel",
      labor: "Users",
      maintenance: "Settings",
      harvest: "Scissors",
      sale: "DollarSign",
      other: "Package"
    };
    return iconMap[category.toLowerCase()] || "DollarSign";
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(Math.abs(amount));
    
    return type === "expense" ? `-${formattedAmount}` : `+${formattedAmount}`;
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  transaction.type === "expense" 
                    ? "bg-gradient-to-br from-red-500 to-red-600"
                    : "bg-gradient-to-br from-green-500 to-green-600"
                )}>
                  <ApperIcon 
                    name={getCategoryIcon(transaction.category)} 
                    className="w-6 h-6 text-white" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">
                      {transaction.description || `${transaction.category} ${transaction.type}`}
                    </h3>
                    <Badge 
                      variant={transaction.type === "expense" ? "danger" : "success"}
                      className="capitalize"
                    >
                      {transaction.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>{getFarmName(transaction.farmId)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Tag" className="w-4 h-4" />
                      <span className="capitalize">{transaction.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={cn(
                  "text-xl font-display font-bold",
                  transaction.type === "expense" ? "text-red-600" : "text-green-600"
                )}>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.Id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;