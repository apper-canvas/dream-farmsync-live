import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, icon, trend, trendValue, gradient = "from-primary-500 to-primary-600" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <ApperIcon name={icon} className="w-5 h-5 text-white" />
          </div>
          
          {trend && (
            <div className={`flex items-center text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className="w-4 h-4 mr-1" 
              />
              {trendValue}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-2xl font-display font-bold text-gray-900 mb-1">
            {value}
          </div>
          <div className="text-sm text-gray-600">
            {title}
          </div>
        </div>
</div>
      </Card>
    </motion.div>
  );
};

export default StatCard;