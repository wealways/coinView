import axios from 'axios';

const API_BASE_URL = 'https://api.upbit.com/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.response.use(
  response => response,
  error => {
    
    const status = error.response ? error.response.status : null;
    const message = error.response ? error.response.data.message : error.message;

    return Promise.reject(error);
  }
);


export default {

  async getSymbols(){
    const res = await apiClient.get('/market/all')
    return res
  },

  async getTickers(markets = []) {
    return await apiClient.get('/ticker', {
      params: { markets: markets.join(',') },
    })
  }
};