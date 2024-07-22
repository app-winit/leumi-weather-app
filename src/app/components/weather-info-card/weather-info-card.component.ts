import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weather-info-card',
  templateUrl: './weather-info-card.component.html',
  styleUrls: ['./weather-info-card.component.css'],
  standalone: true,
  imports:[
    CommonModule
  ],
  providers: [
    DatePipe
  ]

})
export class WeatherInfoCardComponent {
  @Input() currentWeatherForecast: any;

}