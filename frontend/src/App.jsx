import { useState, useEffect } from 'react'
import axios from 'axios'

import TransactionTable from './components/transactions/TransactionTable'
import TransactionFilters from './components/transactions/TransactionFilters'
import Statistics from './components/transactions/Statistics'
import BarChart from './components/charts/BarChart'
import PieChart from './components/charts/PieChart'
import Pagination from './components/Pagination'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [selectedMonth, setSelectedMonth] = useState(3)
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [barChartData, setBarChartData] = useState(null)
  const [pieChartData, setPieChartData] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await axios.get(`${API_BASE_URL}/initialize-database`)
        await fetchTransactions()
        await fetchStatistics()
        await fetchBarChartData()
        await fetchPieChartData()
      } catch (error) {
        console.error('Error initializing database:', error)
        setError(error.message || 'Failed to initialize database')
      } finally {
        setIsLoading(false)
      }
    }

    initializeDatabase()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      fetchTransactions()
      fetchStatistics()
      fetchBarChartData()
      fetchPieChartData()
    }
  }, [selectedMonth, searchText, currentPage])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        params: {
          month: selectedMonth,
          search: searchText,
          page: currentPage,
          perPage: 10
        }
      })
      setTransactions(response.data.transactions)
      setTotalPages(Math.ceil(response.data.total / response.data.perPage))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError(error.message || 'Failed to fetch transactions')
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics`, {
        params: { month: selectedMonth }
      })
      setStatistics(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bar-chart`, {
        params: { month: selectedMonth }
      })
      setBarChartData(response.data)
    } catch (error) {
      console.error('Error fetching bar chart data:', error)
    }
  }

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pie-chart`, {
        params: { month: selectedMonth }
      })
      setPieChartData(response.data)
    } catch (error) {
      console.error('Error fetching pie chart data:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction Dashboard</h1>
        
        <TransactionFilters
          selectedMonth={selectedMonth}
          setSelectedMonth={(month) => {
            setSelectedMonth(month)
            setCurrentPage(1)
          }}
          searchText={searchText}
          setSearchText={(text) => {
            setSearchText(text)
            setCurrentPage(1)
          }}
          months={MONTHS}
        />

        <Statistics statistics={statistics} />

        <TransactionTable transactions={transactions} />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BarChart data={barChartData} />
          <PieChart data={pieChartData} />
        </div>
      </div>
    </div>
  )
}

export default App
