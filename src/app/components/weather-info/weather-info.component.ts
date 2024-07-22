import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DailyWeather, WeatherForecast } from './../../models/weather.model';
import { Store } from '@ngrx/store';
import * as WeatherActions from './../../store/weather.actions';
import * as fromApp from './../../store/app.reducer';
import { ToastrService } from 'ngx-toastr';
import { WeatherInfoCardComponent } from '../weather-info-card/weather-info-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.css'],
  standalone: true,
  imports: [
    WeatherInfoCardComponent,
    NgIf,
    HttpClientModule,
    NgForOf
  ]
})
export class WeatherInfoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  fetchedCityIndex: number = 0;
  fetchedCityName: string = '';
  dailyTemperature: number = 0;
  weatherText: string = '';
  weatherIcon: string = '';
  isDailyLoading: boolean = false;
  currentWeatherForecast: WeatherForecast[] = [];
  isForecastLoading: boolean = false;
  initialCityFetchedIndex: any;
  initialCityFetchedName: string = '';

  constructor(private weatherService: WeatherService,
    private store: Store<fromApp.AppState>,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.subscription = this.store.select('weather').subscribe(
    //   weatherStateData => {
    //     this.fetchedCityIndex = weatherStateData.currentDailyWeather.fetchedCityIndex;
    //     this.fetchedCityName = weatherStateData.currentDailyWeather.fetchedCityName;
    //     this.dailyTemperature = weatherStateData.currentDailyWeather.dailyTemperature;
    //     this.weatherText = weatherStateData.currentDailyWeather.weatherText;
    //     this.weatherIcon = weatherStateData.currentDailyWeather.weatherIcon;
    //     this.isDailyLoading = weatherStateData.isDailyLoading;
    //     this.currentWeatherForecast = weatherStateData.currentWeatherForecast;
    //     this.isForecastLoading = weatherStateData.isForecastLoading;
    //   })
    if (this.fetchedCityIndex === null) {
      this.store.dispatch(new WeatherActions.ShowDailySpinner());
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.subscription = this.weatherService.getGeolocation(latitude, longitude).subscribe((geoLocationData: any) => {
            this.initialCityFetchedIndex = +geoLocationData.Key;
            this.initialCityFetchedName = geoLocationData.EnglishName;
            this.subscription = this.weatherService.getDailyWeather(this.initialCityFetchedIndex)
              .pipe(map((dailyWeatherData: any) => {
                return dailyWeatherData.map((res: { Temperature: { Metric: { Value: any; }; }; WeatherText: any; WeatherIcon: number; }) => ({
                  fetchedCityIndex: this.initialCityFetchedIndex,
                  fetchedCityName: this.initialCityFetchedName,
                  dailyTemperature: res.Temperature.Metric.Value,
                  weatherText: res.WeatherText,
                  weatherIcon: res.WeatherIcon < 10 ? (0 + (res.WeatherIcon).toString()) : (res.WeatherIcon).toString()
                }))
              }))
              .subscribe((dailyWeatherData: { currentDailyWeather: DailyWeather; }[]) => {
                this.store.dispatch(new WeatherActions.UpdateDailyWeather(dailyWeatherData[0]));
              }, error => {
                this.toastr.error('An error occurred, Please try again later', 'Error!');
                this.store.dispatch(new WeatherActions.RemoveDailySpinner());
                console.log(error);
              })
            this.store.dispatch(new WeatherActions.ShowForecastSpinner());
            this.subscription = this.weatherService.getForecastWeather(this.initialCityFetchedIndex)
              .pipe(map((forecastWeatherData: any) => {
                return forecastWeatherData.DailyForecasts.map((res: { Temperature: { Minimum: { Value: any; }; }; Date: any; Day: { Icon: number; }; }) => ({
                  temperature: res.Temperature.Minimum.Value,
                  date: res.Date,
                  weatherIcon: res.Day.Icon < 10 ? (0 + (res.Day.Icon).toString()) : (res.Day.Icon).toString()
                }))
              }))
              .subscribe((forecastWeatherData: { currentWeatherForecast: WeatherForecast[]; }) => {
                this.store.dispatch(new WeatherActions.UpdateForecastWeather(forecastWeatherData));
              }, error => {
                this.toastr.error('An error occurred, Please try again later', 'Error!');
                this.store.dispatch(new WeatherActions.RemoveForecastSpinner());
                console.log(error);
              })
          })
        }, error => {
          this.toastr.error('Please accept geolocation in order to let the app set your default location', 'Error!');
          console.log(error);
        });
      } else {
        this.toastr.error('No support for geolocation', 'Error!');
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}