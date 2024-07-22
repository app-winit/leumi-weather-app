import { Component, OnDestroy } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as WeatherActions from '../../store/weather.actions';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Autocomplete } from './../../models/autocomplete.model';
import * as fromApp from './../../store/app.reducer';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css'],
  standalone: true,
  imports: [
    AutocompleteLibModule,
    NgIf,
    HttpClientModule
  ]
})
export class WeatherSearchComponent implements OnDestroy {

  constructor(private weatherService: WeatherService,
    private store: Store<fromApp.AppState>,
    private toastr: ToastrService
  ) { }

  keyword: string = 'name';
  autocompleteData: Autocomplete[] = [];
  isSearchValid: boolean = true;
  subscription: Subscription = new Subscription;

  onSelectEvent(selectedQueryEvent: any): void {
    this.store.dispatch(new WeatherActions.ShowDailySpinner());
    this.subscription = this.weatherService.getDailyWeather(selectedQueryEvent.id)
      .pipe(map((dailyWeatherData: any) => {
        return dailyWeatherData.map((res: { Temperature: any; WeatherText: any; WeatherIcon: number; }) => ({
          fetchedCityIndex: selectedQueryEvent.id,
          fetchedCityName: selectedQueryEvent.name,
          dailyTemperature: res.Temperature.Metric.Value,
          weatherText: res.WeatherText,
          weatherIcon: res.WeatherIcon < 10 ? (0 + (res.WeatherIcon).toString()) : (res.WeatherIcon).toString()
        }))
      }))
      .subscribe(dailyWeatherData => {
        this.store.dispatch(new WeatherActions.UpdateDailyWeather(dailyWeatherData[0]));
      }, error => {
        this.toastr.error('An error occurred, Please try again later', 'Error!');
        this.store.dispatch(new WeatherActions.RemoveDailySpinner());
        console.log(error);
      })
    this.store.dispatch(new WeatherActions.ShowForecastSpinner());
    this.subscription = this.weatherService.getForecastWeather(selectedQueryEvent.id)
      .pipe(map((forecastWeatherData: any) => {
        return forecastWeatherData.DailyForecasts.map((res: { Temperature: any; Date: any; Day: { Icon: number; }; }) => ({
          temperature: res.Temperature.Minimum.Value,
          date: res.Date,
          weatherIcon: res.Day.Icon < 10 ? (0 + (res.Day.Icon).toString()) : (res.Day.Icon).toString()
        }))
      }))
      .subscribe(forecastWeatherData => {
        this.store.dispatch(new WeatherActions.UpdateForecastWeather(forecastWeatherData));
      }, error => {
        this.toastr.error('An error occurred, Please try again later', 'Error!');
        console.log(error);
      })
  }

  restrictNonEnglishLetters(event: any): void {
    const pattern = /^[A-Za-z]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      this.isSearchValid = false;
      event.preventDefault();
    } else {
      this.isSearchValid = true;
    }
  }

  onChangeSearch(searchedQuery: string): void {
    if (searchedQuery !== '') {
      this.subscription = this.weatherService.getAutocompleteSearch(searchedQuery)
        .pipe(map((autocompleteResults: any) => {
          return autocompleteResults.map((res: { Key: string | number; LocalizedName: any; }) => ({
            id: + res.Key,
            name: res.LocalizedName
          }))
        }))
        .subscribe(autocompleteResults => {
          this.autocompleteData = autocompleteResults;
        }, error => {
          this.toastr.error('An error occurred, Please try again later', 'Error!');
          console.log(error);
        })
    }
  }

  onAutocompleteCleared(): void {
    this.autocompleteData = [];
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}