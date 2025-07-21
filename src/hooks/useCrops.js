import { useState, useEffect } from "react";
import { cropService } from "@/services/api/cropService";

export const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cropService.getAll();
      setCrops(data);
    } catch (err) {
      setError(err.message || "Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const createCrop = async (cropData) => {
    try {
      const newCrop = await cropService.create(cropData);
      setCrops(prev => [...prev, newCrop]);
      return newCrop;
    } catch (err) {
      throw new Error(err.message || "Failed to create crop");
    }
  };

  const updateCrop = async (id, cropData) => {
    try {
const updatedCrop = await cropService.update(id, cropData);
      if (updatedCrop) {
        setCrops(prev => prev.map(crop => crop.Id === id ? updatedCrop : crop));
      }
      return updatedCrop;
    } catch (err) {
      throw new Error(err.message || "Failed to update crop");
    }
  };

  const deleteCrop = async (id) => {
    try {
      await cropService.delete(id);
      setCrops(prev => prev.filter(crop => crop.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete crop");
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  return {
    crops,
    loading,
    error,
    refetch: loadCrops,
    createCrop,
    updateCrop,
    deleteCrop
  };
};