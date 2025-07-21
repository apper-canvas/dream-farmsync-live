import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Header from "@/components/organisms/Header";
import FarmCard from "@/components/organisms/FarmCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

import { useFarms } from "@/hooks/useFarms";

const Farms = () => {
  const { onMenuClick } = useOutletContext();
  const { farms, loading, error, createFarm, updateFarm, deleteFarm } = useFarms();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    sizeUnit: "acres"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      size: "",
      sizeUnit: "acres"
    });
    setShowAddForm(false);
    setEditingFarm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.size) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.Id, {
          ...formData,
          size: parseFloat(formData.size)
        });
        toast.success("Farm updated successfully!");
      } else {
        await createFarm({
          ...formData,
          size: parseFloat(formData.size)
        });
        toast.success("Farm created successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save farm");
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    });
    setShowAddForm(true);
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteFarm(farmId);
      toast.success("Farm deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete farm");
    }
  };

  const handleViewDetails = (farm) => {
    toast.info(`Viewing details for ${farm.name}`);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Farm Management" 
        subtitle={`Managing ${farms.length} farm${farms.length !== 1 ? "s" : ""}`}
        onMenuClick={onMenuClick}
        showMenu
        actions={
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Farm
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
                  {editingFarm ? "Edit Farm" : "Add New Farm"}
                </h2>
                <Button variant="ghost" onClick={resetForm}>
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Farm Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Green Valley Farm"
                  />
                  
                  <Input
                    label="Location *"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Iowa, USA"
                  />
                  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Input
                        label="Size *"
                        name="size"
                        type="number"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="150"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="w-32">
                      <Select
                        label="Unit"
                        name="sizeUnit"
                        value={formData.sizeUnit}
                        onChange={handleInputChange}
                      >
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                        <option value="sq ft">Sq Ft</option>
                        <option value="sq m">Sq M</option>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button type="submit">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {editingFarm ? "Update Farm" : "Add Farm"}
                  </Button>
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Farms Grid */}
        {farms.length === 0 ? (
          <Empty
            icon="MapPin"
            title="No farms yet"
            message="Start by adding your first farm to begin tracking your agricultural operations."
            actionLabel="Add Farm"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm, index) => (
              <motion.div
                key={farm.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FarmCard
                  farm={farm}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Farms;