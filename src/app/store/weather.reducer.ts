import * as WeatherActions from './weather.actions';
import { WeatherForecast, DailyWeather } from '../models/weather.model';

export interface State {
  currentDailyWeather: DailyWeather,
  isDailyLoading: boolean,
  currentWeatherForecast: WeatherForecast[],
  isForecastLoading: boolean,
}

const initialState: State = {
  currentDailyWeather: {
    fetchedCityIndex: 0,
    fetchedCityName: '',
    dailyTemperature: 0,
    weatherText: '',
    weatherIcon: ''
  },
  isDailyLoading: false,
  currentWeatherForecast: [],
  isForecastLoading: false,
}

export function weatherReducer(state: State = initialState, action: any) {
  switch (action.type) {
    case WeatherActions.UPDATE_DAILY_WEATHER:
      return {
        ...state,
        currentDailyWeather: action.payload,
        isDailyLoading: false
      }
    case WeatherActions.UPDATE_FORECAST_WEATHER:
      return {
        ...state,
        currentWeatherForecast: action.payload,
        isForecastLoading: false
      }
    case WeatherActions.SHOW_DAILY_SPINNER:
      return {
        ...state,
        isDailyLoading: true
      }
    case WeatherActions.SHOW_FORECAST_SPINNER:
      return {
        ...state,
        isForecastLoading: true
      }
    case WeatherActions.REMOVE_DAILY_SPINNER:
      return {
        ...state,
        isDailyLoading: false
      }
    case WeatherActions.REMOVE_FORECAST_SPINNER:
      return {
        ...state,
        isForecastLoading: false
      }
    default:
      return state;
  }
}