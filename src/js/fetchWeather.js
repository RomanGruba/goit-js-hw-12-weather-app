export default function fetchWeather(query) {
  const baseUrl = 'https://api.apixu.com/v1/current.json';
  const key = '1890115529e84a47b6784833190608';
  return fetch(`${baseUrl}?key=${key}&q=${query}`);
}
