import './styles.css';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';

import currentPosition from './js/getGeoPosition';
import fetchWeather from './js/fetchWeather';



class WeatherPlugin {
  constructor() {
    this.lat = null;
    this.long = null;
    this.refs = {
      inputCity: document.querySelector('input[name="city"]'),
      buttonSubmit: document.querySelector('button[type="submit"]'),
      section: document.querySelector('#weather'),
      icon: document.querySelector('.icon'),
      location: document.querySelector('span[data-field="location"]'),
      temp: document.querySelector('span[data-field="temp"]'),
      humidity: document.querySelector('span[data-field="humidity"]'),
      wind: document.querySelector('span[data-field="wind"]'),
      conditions: document.querySelector('span[data-field="conditions"]'),
    };
    this.currentLocation();
    this.searchByCity();
  }

  currentLocation() {
    currentPosition()
      .then(data => {
        this.lat = data.coords.latitude;
        this.long = data.coords.longitude;
        this.currentWeather();
      })
      .catch(() =>
        PNotify.alert(
          'Нет прав доступа к геопозиции, используйте поиск по имени города.',
        ),
      );
  }

  currentWeather() {
    fetchWeather(`${this.lat},${this.long}`)
      .then(res => res.json())
      .then(data => this.render(data));
  }

  searchByCity() {
    this.refs.buttonSubmit.addEventListener('click', e => {
      e.preventDefault();
      fetchWeather(this.refs.inputCity.value)
        .then(res => res.json())
        .then(data => this.render(data));
    });
  }

  render(data) {
    this.refs.location.textContent = data.location.name;
    this.refs.temp.textContent = data.current.temp_c + '°C';
    this.refs.humidity.textContent = data.current.humidity + '%';
    this.refs.wind.textContent = data.current.wind_kph + ' kph';
    this.refs.conditions.textContent = data.current.condition.text;
    this.refs.icon.src = 'https:' + data.current.condition.icon;
    this.refs.section.classList.remove('is-hidden');
  }
}

const weather = new WeatherPlugin();
