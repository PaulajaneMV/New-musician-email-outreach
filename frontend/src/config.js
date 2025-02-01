const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://musician-email-backend-08dfa4e34da5.herokuapp.com',
  // For local development, you can uncomment this:
  // apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://your-heroku-app-name.herokuapp.com',
};

export default config;
