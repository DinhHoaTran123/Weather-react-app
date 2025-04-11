// src/api.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

// Lấy tọa độ của thành phố (GeoCoding API)
export const getCoordinates = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error('Không tìm thấy tọa độ cho thành phố này.');
    }
  } catch (error) {
    throw error;
  }
};

// Lấy dữ liệu thời tiết theo tọa độ (One Call API)
export const getWeatherData = async (lat, lon) => {
  try {
    // Sử dụng units=metric để lấy nhiệt độ theo độ C
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
