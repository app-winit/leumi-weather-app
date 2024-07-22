import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';
import { WeatherInfoComponent } from './components/weather-info/weather-info.component';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { WeatherInfoCardComponent } from './components/weather-info-card/weather-info-card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    WeatherDashboardComponent,
    WeatherInfoComponent,
    WeatherSearchComponent,
    WeatherInfoCardComponent
  ]
})
export class AppComponent {
  title = 'leumi-weather-app';
}
