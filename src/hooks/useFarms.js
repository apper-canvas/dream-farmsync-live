import { useState, useEffect } from "react";
import { farmService } from "@/services/api/farmService";

export const useFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError(err.message || "Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const createFarm = async (farmData) => {
    try {
      const newFarm = await farmService.create(farmData);
      setFarms(prev => [...prev, newFarm]);
      return newFarm;
    } catch (err) {
      throw new Error(err.message || "Failed to create farm");
    }
  };

  const updateFarm = async (id, farmData) => {
    try {
      const updatedFarm = await farmService.update(id, farmData);
      setFarms(prev => prev.map(farm => farm.Id === id ? updatedFarm : farm));
      return updatedFarm;
    } catch (err) {
      throw new Error(err.message || "Failed to update farm");
    }
  };

  const deleteFarm = async (id) => {
    try {
      await farmService.delete(id);
      setFarms(prev => prev.filter(farm => farm.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete farm");
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  return {
    farms,
    loading,
    error,
    refetch: loadFarms,
    createFarm,
    updateFarm,
    deleteFarm
  };
};