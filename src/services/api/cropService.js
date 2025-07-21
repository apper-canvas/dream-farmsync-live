import { toast } from "react-toastify";

export const cropService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "plantingDate_c" } },
          { field: { Name: "expectedHarvestDate_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farmId_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "plantingDate_c" } },
          { field: { Name: "expectedHarvestDate_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farmId_c" } }
        ]
      };

      const response = await apperClient.getRecordById('crop_c', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "plantingDate_c" } },
          { field: { Name: "expectedHarvestDate_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farmId_c" } }
        ],
        where: [
          {
            FieldName: "farmId_c",
            Operator: "EqualTo",
            Values: [farmId]
          }
        ]
      };

      const response = await apperClient.fetchRecords('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crops for farm ${farmId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: cropData.name,
          variety_c: cropData.variety,
          plantingDate_c: cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate,
          field_c: cropData.field,
          status_c: cropData.status,
          farmId_c: parseInt(cropData.farmId)
        }]
      };

      const response = await apperClient.createRecord('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create crop ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords[0]?.data || null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          Name: cropData.name,
          variety_c: cropData.variety,
          plantingDate_c: cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate,
          field_c: cropData.field,
          status_c: cropData.status,
          farmId_c: parseInt(cropData.farmId)
        }]
      };

      const response = await apperClient.updateRecord('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update crop ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates[0]?.data || null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete crop ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};