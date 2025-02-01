const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://musician-email-backend-08dfa4e34da5.herokuapp.com';
// For local development, uncomment this:
// const API_BASE_URL = process.env.NODE_ENV === 'development' 
//   ? 'http://localhost:5000' 
//   : 'https://your-heroku-app-name.herokuapp.com';

export default API_BASE_URL;
