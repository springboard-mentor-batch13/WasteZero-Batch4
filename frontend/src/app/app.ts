import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHost } from './shared/toast-host/toast-host';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastHost],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
