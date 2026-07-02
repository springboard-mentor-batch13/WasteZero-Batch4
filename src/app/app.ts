import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Yeh zaroori hai RouterOutlet ke liye

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Yahan add karna mat bhoolna
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}