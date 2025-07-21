import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

export const transactionService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...transactions];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return transactions.find(transaction => transaction.Id === id);
  },

  async getByFarmId(farmId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return transactions.filter(transaction => transaction.farmId === farmId);
  },

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  },

  async create(transactionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTransaction = {
      Id: Math.max(...transactions.map(t => t.Id)) + 1,
      ...transactionData,
      date: transactionData.date || new Date().toISOString()
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  async update(id, transactionData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = transactions.findIndex(transaction => transaction.Id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...transactionData };
      return transactions[index];
    }
    throw new Error("Transaction not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = transactions.findIndex(transaction => transaction.Id === id);
    if (index !== -1) {
      const deleted = transactions.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Transaction not found");
  }
};