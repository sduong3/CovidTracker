import axios from 'axios';

const instance = axios.create({
  baseURL:'https://covidtracker-99c92.firebaseio.com/'
})

export default instance;
