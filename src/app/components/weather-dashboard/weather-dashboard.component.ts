import { Component } from '@angular/core';
import { WeatherSearchComponent } from '../weather-search/weather-search.component';
import { WeatherInfoComponent } from '../weather-info/weather-info.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.css'],
  standalone: true,
  imports: [
    WeatherSearchComponent,
    WeatherInfoComponent,
    HttpClientModule
  ]
})
export class WeatherDashboardComponent {}