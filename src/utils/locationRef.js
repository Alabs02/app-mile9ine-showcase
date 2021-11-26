const baseUrl = (process.env.NODE_ENV === 'production') ? 'https://app.mile9ine.com' : 'http://localhost:3000';
const locationRef = (route) => {
  window.location.href = `${baseUrl}${route}`;
}

export default locationRef;