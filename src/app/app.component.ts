import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-certificate-app';
  
  open(modal: any) {
    // This method will be called when the button is clicked
    console.log('Opening modal:', modal);
  }
}