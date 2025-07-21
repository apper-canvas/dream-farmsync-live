import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth } from "date-fns";

import Header from "@/components/organisms/Header";
import TransactionList from "@/components/organisms/TransactionList";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

import { useTransactions } from "@/hooks/useTransactions";
import { useFarms } from "@/hooks/useFarms";

const Finance = () => {
  const { onMenuClick } = useOutletContext();
  const { transactions, loading: transactionsLoading, error: transactionsError, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { farms, loading: farmsLoading, error: farmsError } = useFarms();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    amount: "",
    category: "seeds",
    date: format(new Date(), "yyyy-MM-dd"),
    description: ""
  });

  const loading = transactionsLoading || farmsLoading;
  const error = transactionsError || farmsError;

  const expenseCategories = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "equipment", label: "Equipment" },
    { value: "fuel", label: "Fuel" },
    { value: "labor", label: "Labor" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  const incomeCategories = [
    { value: "sale", label: "Product Sale" },
    { value: "harvest", label: "Harvest" },
    { value: "subsidy", label: "Government Subsidy" },
    { value: "other", label: "Other" }
  ];

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
      type: "expense",
      amount: "",
      category: "seeds",
      date: format(new Date(), "yyyy-MM-dd"),
      description: ""
    });
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId || !formData.amount || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const transactionData = {
        ...formData,
        farmId: parseInt(formData.farmId),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await createTransaction(transactionData);
        toast.success("Transaction added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      farmId: transaction.farmId.toString(),
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: format(new Date(transaction.date), "yyyy-MM-dd"),
      description: transaction.description || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await deleteTransaction(transactionId);
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete transaction");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} />;

  // Calculate financial stats
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = monthlyTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = monthlyTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const categories = formData.type === "expense" ? expenseCategories : incomeCategories;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Financial Management" 
        subtitle={`Tracking ${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`}
        onMenuClick={onMenuClick}
        showMenu
        actions={
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        }
      />
      
      <div className="p-6 space-y-8">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Income"
            value={`$${totalIncome.toLocaleString()}`}
            icon="TrendingUp"
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            icon="TrendingDown"
            gradient="from-red-500 to-red-600"
          />
          <StatCard
            title="Net Profit"
            value={`$${(totalIncome - totalExpenses).toLocaleString()}`}
            icon="DollarSign"
            gradient="from-primary-500 to-primary-600"
            trend={totalIncome > totalExpenses ? "up" : "down"}
          />
          <StatCard
            title="This Month"
            value={`$${(monthlyIncome - monthlyExpenses).toLocaleString()}`}
            icon="Calendar"
            gradient="from-blue-500 to-blue-600"
          />
        </div>

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
                  {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
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
                  
                  <Select
                    label="Type *"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Select>
                  
                  <Input
                    label="Amount *"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                  
                  <Input
                    label="Date *"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-colors duration-200"
                    placeholder="Add any additional details about this transaction..."
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button type="submit">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {editingTransaction ? "Update Transaction" : "Add Transaction"}
                  </Button>
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <Empty
            icon="Receipt"
            title="No transactions yet"
            message="Start tracking your farm finances by adding your first transaction."
            actionLabel="Add Transaction"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <TransactionList
            transactions={transactions}
            farms={farms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Finance;