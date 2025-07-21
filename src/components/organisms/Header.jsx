import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, subtitle, onMenuClick, showMenu = false, actions }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;