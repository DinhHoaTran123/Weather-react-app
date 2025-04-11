// src/components/WeatherWidget.js
import React, { useState, useEffect } from 'react';
import { getCoordinates, getWeatherData } from '../api';

const WeatherWidget = ({ city, id, onDelete }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastMode, setForecastMode] = useState('hourly'); // 'hourly' hoặc 'daily'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Lấy tọa độ của thành phố
      const geoData = await getCoordinates(city);
      // Lấy dữ liệu thời tiết theo tọa độ
      const data = await getWeatherData(geoData.lat, geoData.lon);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();

    // Auto refresh dữ liệu mỗi 10 phút (600000 ms)
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const handleModeSwitch = (mode) => {
    setForecastMode(mode);
  };

  return (
    <div style={styles.widgetContainer}>
      <div style={styles.header}>
        <h3>{city}</h3>
        <button onClick={() => onDelete(id)} style={styles.deleteButton}>
          X
        </button>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Lỗi: {error}</p>
      ) : (
        <div>
          {/* Thông tin thời tiết hiện tại */}
          <div style={styles.currentWeather}>
            <p><strong>Nhiệt độ:</strong> {weatherData.current.temp}°C</p>
            <p><strong>Độ ẩm:</strong> {weatherData.current.humidity}%</p>
            <p><strong>Gió:</strong> {weatherData.current.wind_speed} m/s</p>
            <p>
              <strong>Thời tiết:</strong> {weatherData.current.weather[0].description}
            </p>
          </div>

          {/* Chuyển đổi giữa dự báo theo giờ và theo ngày */}
          <div style={styles.modeSwitch}>
            <button
              onClick={() => handleModeSwitch('hourly')}
              style={forecastMode === 'hourly' ? styles.activeMode : null}
            >
              Dự báo theo giờ
            </button>
            <button
              onClick={() => handleModeSwitch('daily')}
              style={forecastMode === 'daily' ? styles.activeMode : null}
            >
              Dự báo theo ngày
            </button>
          </div>

          {forecastMode === 'hourly' ? (
            <div style={styles.forecastContainer}>
              <h4>Dự báo theo giờ (24 giờ)</h4>
              <div style={styles.forecastList}>
                {weatherData.hourly.slice(0, 24).map((hourData, index) => {
                  const date = new Date(hourData.dt * 1000);
                  const hour = date.getHours();
                  return (
                    <div key={index} style={styles.forecastItem}>
                      <p>{hour}:00</p>
                      <p>{hourData.temp}°C</p>
                      <p>{hourData.weather[0].main}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={styles.forecastContainer}>
              <h4>Dự báo theo ngày (7 ngày)</h4>
              <div style={styles.forecastList}>
                {weatherData.daily.slice(0, 7).map((dayData, index) => {
                  const date = new Date(dayData.dt * 1000);
                  return (
                    <div key={index} style={styles.forecastItem}>
                      <p>{date.toLocaleDateString()}</p>
                      <p>Max: {dayData.temp.max}°C</p>
                      <p>Min: {dayData.temp.min}°C</p>
                      <p>{dayData.weather[0].main}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  widgetContainer: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    width: '300px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deleteButton: {
    background: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    cursor: 'pointer'
  },
  currentWeather: {
    marginBottom: '10px'
  },
  modeSwitch: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px'
  },
  activeMode: {
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  forecastContainer: {
    overflowX: 'auto'
  },
  forecastList: {
    display: 'flex'
  },
  forecastItem: {
    minWidth: '70px',
    marginRight: '10px',
    textAlign: 'center',
    border: '1px solid #eee',
    borderRadius: '4px',
    padding: '4px'
  }
};

export default WeatherWidget;
