import { useState, useEffect } from "react";
import { transactionService } from "@/services/api/transactionService";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (err) {
      throw new Error(err.message || "Failed to create transaction");
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
const updatedTransaction = await transactionService.update(id, transactionData);
      if (updatedTransaction) {
        setTransactions(prev => prev.map(transaction =>
        transaction.Id === id ? updatedTransaction : transaction
));
      }
      return updatedTransaction;
    } catch (err) {
      throw new Error(err.message || "Failed to update transaction");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(transaction => transaction.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete transaction");
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
};