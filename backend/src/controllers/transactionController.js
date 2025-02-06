const transactionService = require('../services/transactionService');

const getTransactions = async (req, res) => {
    try {
        const { month, search = "", page = 1, perPage = 10 } = req.query;
        const result = await transactionService.getTransactions(month, search, page, perPage);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const initializeDatabase = async (req, res) => {
    try {
        await transactionService.initializeDatabase();
        res.json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        const statistics = await transactionService.getStatistics(month);
        res.json(statistics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
        const data = await transactionService.getBarChartData(month);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
        const data = await transactionService.getPieChartData(month);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;
        const data = await transactionService.getCombinedData(month);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTransactions,
    initializeDatabase,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};
