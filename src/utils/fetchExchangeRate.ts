import axios from 'axios';

export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/AUD'); // Replace with actual API
    // return response.data.rates.USD; // Adjust based on API response structure
    return parseFloat(Math.random().toFixed(2));
  } catch (error) {
    console.error("Error fetching exchange rate", error);
    return 0.6; // Fallback to default rate
  }
};
