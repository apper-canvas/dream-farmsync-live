import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Farms", href: "/farms", icon: "MapPin" },
    { name: "Crops", href: "/crops", icon: "Sprout" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Finance", href: "/finance", icon: "DollarSign" },
    { name: "Weather", href: "/weather", icon: "Cloud" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={() => onClose?.()}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
            : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          className={cn(
            "w-5 h-5 mr-3 transition-colors",
            isActive ? "text-white" : "text-gray-500 group-hover:text-primary-600"
          )}
        />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Sprout" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-display font-bold text-gray-900">FarmSync</h1>
              <p className="text-xs text-gray-600">Farm Management</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-6">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          
          <div className="mt-auto pt-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-900">Pro Tip</span>
              </div>
              <p className="text-xs text-primary-700">
                Check weather before scheduling outdoor tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Sprout" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-display font-bold text-gray-900">FarmSync</h1>
                  <p className="text-xs text-gray-600">Farm Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col flex-grow px-4 py-6">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;