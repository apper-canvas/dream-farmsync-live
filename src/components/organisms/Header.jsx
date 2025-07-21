import { motion } from "framer-motion";
import React, { useContext } from "react";
import { AuthContext } from "@/App";
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
        
        <div className="flex items-center space-x-3">
          {actions && actions}
          <LogoutButton />
        </div>
      </div>
    </motion.header>
  );
};
const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="hover:bg-red-50 hover:text-red-600"
    >
      <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
};

export default Header;