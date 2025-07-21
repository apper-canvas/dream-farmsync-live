import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-200 rounded-lg h-64"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-16"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;