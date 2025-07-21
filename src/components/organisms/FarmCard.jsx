import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { formatDistance } from "date-fns";

const FarmCard = ({ farm, onEdit, onDelete, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card 
      hover
      className="relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="absolute top-4 right-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="flex space-x-1"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(farm)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(farm.Id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900">
              {farm.name}
            </h3>
            <p className="text-sm text-gray-600">{farm.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Size</div>
            <div className="text-lg font-semibold text-gray-900">
              {farm.size} {farm.sizeUnit}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Created</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDistance(new Date(farm.createdAt), new Date(), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(farm)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FarmCard;