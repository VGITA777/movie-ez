import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationRailComponent} from './navigation-rail/navigation-rail.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationRailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
