const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async () => {
  try {
    const existingCount = await Transaction.countDocuments();
    if (existingCount === 0) {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      await Transaction.insertMany(response.data);
    }
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const getTransactions = async (month, search, page, perPage) => {
  try {
    const year = 2022;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const query = {
      dateOfSale: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const price = !isNaN(search) ? Number(search) : null;

      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];

      if (price !== null) {
        query.$or.push({ price: price });
      }
    }

    const skip = (page - 1) * perPage;
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ dateOfSale: 'asc' })
        .skip(skip)
        .limit(perPage),
      Transaction.countDocuments(query)
    ]);

    return {
      transactions,
      total,
      page,
      perPage
    };
  } catch (error) {
    console.error('Error in getTransactions:', error);
    throw error;
  }
};

const getStatistics = async (month) => {
  try {
    const year = 2022;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const query = {
      dateOfSale: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const transactions = await Transaction.find(query);

    const totalSaleAmount = transactions.reduce((sum, t) => sum + (t.price || 0), 0);
    const totalSoldItems = transactions.filter(t => t.sold).length;
    const totalNotSoldItems = transactions.length - totalSoldItems;

    return {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems
    };
  } catch (error) {
    console.error('Error in getStatistics:', error);
    throw error;
  }
};

const getBarChartData = async (month) => {
  try {
    const year = 2022;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const query = {
      dateOfSale: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const transactions = await Transaction.find(query);

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    transactions.forEach(transaction => {
      const price = transaction.price;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    return priceRanges;
  } catch (error) {
    console.error('Error in getBarChartData:', error);
    throw error;
  }
};

const getPieChartData = async (month) => {
  try {
    const year = 2022;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const query = {
      dateOfSale: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const transactions = await Transaction.find(query);

    const categoryCount = {};
    transactions.forEach(transaction => {
      const category = transaction.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return categoryCount;
  } catch (error) {
    console.error('Error in getPieChartData:', error);
    throw error;
  }
};

const getCombinedData = async (month) => {
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      getStatistics(month),
      getBarChartData(month),
      getPieChartData(month)
    ]);

    return {
      statistics,
      barChart,
      pieChart
    };
  } catch (error) {
    console.error('Error in getCombinedData:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
};
