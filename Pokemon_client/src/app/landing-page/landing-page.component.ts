import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SharedModule, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {}
