import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { getApiUrl } from '../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Chart Dashboard Component
// It displays the top questions asked in the IT support system

function ChartDashboard() {
  const [topQuestions, setTopQuestions] = useState(null);
  const [dailyCounts, setDailyCounts] = useState(null);
  const [csat, setCsat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // 重试函数
  const retryLoadData = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  // 检查网络连接
  const checkNetworkConnection = () => {
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network.');
      return false;
    }
    return true;
  };

  // Fetch top questions from the backend API
  useEffect(() => {
    if (!checkNetworkConnection()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // 创建axios实例，增加超时时间
    const apiClient = axios.create({
      timeout: 60000, // 增加到60秒
      withCredentials: true
    });
    
    // Fetch top questions data
    apiClient.get(`${getApiUrl()}/top-questions`)
      .then(response => {
        console.log('Top questions response:', response.data);
        // 验证数据格式
        if (Array.isArray(response.data) && response.data.length > 0) {
          // 转换数据格式为Chart.js需要的格式
          const chartData = {
            labels: response.data.map(item => item.question || 'Unknown'),
            datasets: [{
              label: 'Question Count',
              data: response.data.map(item => item.count || 0),
              backgroundColor: 'rgba(102, 126, 234, 0.8)',
              borderColor: 'rgba(102, 126, 234, 1)',
              borderWidth: 1
            }]
          };
          setTopQuestions(chartData);
        } else {
          console.warn('Top questions data is empty or invalid');
          setTopQuestions(null);
        }
      })
      .catch(error => {
        console.error('Error fetching top questions:', error);
        setTopQuestions(null);
        if (error.code === 'ECONNABORTED') {
          setError('Request timeout - server is taking too long to respond');
        } else if (error.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (error.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to load top questions data');
        }
      });

    // Fetch daily question counts
    apiClient.get(`${getApiUrl()}/daily-question-counts`)
      .then(response => {
        console.log('Daily counts response:', response.data);
        // 验证数据格式
        if (Array.isArray(response.data) && response.data.length > 0) {
          // 转换数据格式为Chart.js需要的格式
          const chartData = {
            labels: response.data.map(item => item.date || 'Unknown'),
            datasets: [{
              label: 'Daily Questions',
              data: response.data.map(item => item.count || 0),
              borderColor: 'rgba(102, 126, 234, 1)',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.1,
              fill: true
            }]
          };
          setDailyCounts(chartData);
        } else {
          console.warn('Daily counts data is empty or invalid');
          setDailyCounts(null);
        }
      })
      .catch(error => {
        console.error('Error fetching daily counts:', error);
        setDailyCounts(null);
        if (error.code === 'ECONNABORTED') {
          setError('Request timeout - server is taking too long to respond');
        } else if (error.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (error.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to load daily counts data');
        }
      });

    // Fetch CSAT data
    apiClient.get(`${getApiUrl()}/csat`)
      .then(response => {
        console.log('CSAT response:', response.data);
        if (response.data && typeof response.data.csat === 'number') {
          setCsat(response.data.csat);
        } else {
          console.warn('CSAT data is invalid');
          setCsat(null);
        }
      })
      .catch(error => {
        console.error('Error fetching CSAT data:', error);
        setCsat(null);
        if (error.code === 'ECONNABORTED') {
          setError('Request timeout - server is taking too long to respond');
        } else if (error.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (error.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to load CSAT data');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [retryCount]); // 添加retryCount作为依赖

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="charts-section">
        <div style={{ textAlign: 'center', padding: '2em' }}>
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="charts-section">
        <div style={{ textAlign: 'center', padding: '2em', color: '#e53e3e' }}>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          {retryCount > 0 && (
            <p style={{ fontSize: '14px', color: '#666' }}>
              Retry attempt: {retryCount}
            </p>
          )}
          <button 
            onClick={retryLoadData} 
            style={{ 
              padding: '0.5em 1em', 
              backgroundColor: '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '1em'
            }}
          >
            Retry
          </button>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '0.5em 1em', 
              backgroundColor: '#e53e3e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="charts-section">
      {/* Top row with two charts side by side */}
      <div style={{ display: 'flex', gap: '2em', marginBottom: '2em' }}>
        {/* Top Questions Chart */}
        <div className="chart-box" style={{ flex: 1 }}>
          <h3>Top 5 Asked Questions</h3>
          <div style={{ height: '250px' }}>
            {topQuestions && topQuestions.labels && topQuestions.labels.length > 0 ? (
              <Bar
                data={topQuestions}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            ) : <p>No data available for top questions</p>}
          </div>
        </div>

        {/* Daily Trends */}
        <div className="chart-box" style={{ flex: 1 }}>
          <h3>Daily Question Volume (7 Days)</h3>
          <div style={{ height: '250px' }}>
            {dailyCounts && dailyCounts.labels && dailyCounts.labels.length > 0 ? (
              <Line
                data={dailyCounts}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            ) : <p>No data available for daily trends</p>}
          </div>
        </div>
      </div>

      {/* CSAT Section */}
      <div className="chart-box" style={{ marginBottom: '2em' }}>
        <h3>Customer Satisfaction Score (CSAT)</h3>
        {csat !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0', color: '#667eea' }}>{csat}%</p>
              <p style={{ fontSize: '16px', color: '#4a5568', margin: '0.5em 0' }}>Customer Satisfaction</p>
            </div>
            <div style={{ width: '200px', height: '200px' }}>
              <Pie
                data={{
                  labels: ['Satisfied', 'Unsatisfied'],
                  datasets: [{
                    data: [csat, 100 - csat],
                    backgroundColor: ['#667eea', '#e2e8f0']
                  }]
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        ) : <p>Loading CSAT...</p>}
      </div>
    </div>
  );
}


export default ChartDashboard;
