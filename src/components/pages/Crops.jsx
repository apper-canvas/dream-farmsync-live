import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";

import Header from "@/components/organisms/Header";
import CropList from "@/components/organisms/CropList";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

import { useCrops } from "@/hooks/useCrops";
import { useFarms } from "@/hooks/useFarms";

const Crops = () => {
  const { onMenuClick } = useOutletContext();
  const { crops, loading: cropsLoading, error: cropsError, createCrop, updateCrop, deleteCrop } = useCrops();
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    name: "",
    variety: "",
    plantingDate: format(new Date(), "yyyy-MM-dd"),
    expectedHarvestDate: "",
    field: "",
    status: "growing"
  });

  const loading = cropsLoading || farmsLoading;
  const error = cropsError || farmsError;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      name: "",
      variety: "",
      plantingDate: format(new Date(), "yyyy-MM-dd"),
      expectedHarvestDate: "",
      field: "",
      status: "growing"
    });
    setShowAddForm(false);
    setEditingCrop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId || !formData.name || !formData.plantingDate || !formData.expectedHarvestDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const cropData = {
        ...formData,
        farmId: parseInt(formData.farmId)
      };

      if (editingCrop) {
        await updateCrop(editingCrop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        await createCrop(cropData);
        toast.success("Crop added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId.toString(),
      name: crop.name,
      variety: crop.variety || "",
      plantingDate: format(new Date(crop.plantingDate), "yyyy-MM-dd"),
      expectedHarvestDate: format(new Date(crop.expectedHarvestDate), "yyyy-MM-dd"),
      field: crop.field || "",
      status: crop.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteCrop(cropId);
      toast.success("Crop deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete crop");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Crop Management" 
        subtitle={`Tracking ${crops.length} crop${crops.length !== 1 ? "s" : ""} across your farms`}
        onMenuClick={onMenuClick}
        showMenu
        actions={
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Crop
          </Button>
        }
      />
      
      <div className="p-6 space-y-8">
        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  {editingCrop ? "Edit Crop" : "Add New Crop"}
                </h2>
                <Button variant="ghost" onClick={resetForm}>
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Select
                    label="Farm *"
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm.Id} value={farm.Id}>
                        {farm.name}
                      </option>
                    ))}
                  </Select>
                  
                  <Input
                    label="Crop Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Corn, Tomatoes, Wheat"
                  />
                  
                  <Input
                    label="Variety"
                    name="variety"
                    value={formData.variety}
                    onChange={handleInputChange}
                    placeholder="e.g., Sweet Corn, Heirloom"
                  />
                  
                  <Input
                    label="Planting Date *"
                    name="plantingDate"
                    type="date"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                  />
                  
                  <Input
                    label="Expected Harvest Date *"
                    name="expectedHarvestDate"
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={handleInputChange}
                  />
                  
                  <Input
                    label="Field/Location"
                    name="field"
                    value={formData.field}
                    onChange={handleInputChange}
                    placeholder="e.g., North Field, Greenhouse 1"
                  />
                  
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="growing">Growing</option>
                    <option value="ready">Ready for Harvest</option>
                    <option value="harvested">Harvested</option>
                    <option value="failed">Failed</option>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button type="submit">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {editingCrop ? "Update Crop" : "Add Crop"}
                  </Button>
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Crops List */}
        {crops.length === 0 ? (
          <Empty
            icon="Sprout"
            title="No crops planted yet"
            message="Start tracking your agricultural production by adding your first crop."
            actionLabel="Add Crop"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <CropList
            crops={crops}
            farms={farms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Crops;