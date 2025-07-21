import { motion } from "framer-motion";
import { useState } from "react";
import { format, differenceInDays, isAfter } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const CropList = ({ crops, farms, onEdit, onDelete }) => {
  const [expandedCrop, setExpandedCrop] = useState(null);

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const getStatusInfo = (crop) => {
    const today = new Date();
    const plantingDate = new Date(crop.plantingDate);
    const harvestDate = new Date(crop.expectedHarvestDate);
    
    if (isAfter(today, harvestDate)) {
      return { status: "overdue", variant: "danger", label: "Overdue" };
    } else if (differenceInDays(harvestDate, today) <= 7) {
      return { status: "ready", variant: "warning", label: "Ready Soon" };
    } else {
      return { status: "growing", variant: "success", label: "Growing" };
    }
  };

  const getDaysUntilHarvest = (crop) => {
    const days = differenceInDays(new Date(crop.expectedHarvestDate), new Date());
    return days;
  };

  return (
    <div className="space-y-4">
      {crops.map((crop, index) => {
        const statusInfo = getStatusInfo(crop);
        const daysUntilHarvest = getDaysUntilHarvest(crop);
        const isExpanded = expandedCrop === crop.Id;

        return (
          <motion.div
            key={crop.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Sprout" className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {crop.name}
                      </h3>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="MapPin" className="w-4 h-4" />
                        <span>{getFarmName(crop.farmId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>Planted {format(new Date(crop.plantingDate), "MMM d")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>
                          {daysUntilHarvest > 0 
                            ? `${daysUntilHarvest} days until harvest`
                            : `${Math.abs(daysUntilHarvest)} days overdue`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedCrop(isExpanded ? null : crop.Id)}
                  >
                    <ApperIcon 
                      name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                      className="w-4 h-4" 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(crop)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(crop.Id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Variety</label>
                      <p className="text-sm text-gray-900">{crop.variety || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Field</label>
                      <p className="text-sm text-gray-900">{crop.field || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Expected Harvest</label>
                      <p className="text-sm text-gray-900">
                        {format(new Date(crop.expectedHarvestDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <p className="text-sm text-gray-900">{crop.status}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CropList;