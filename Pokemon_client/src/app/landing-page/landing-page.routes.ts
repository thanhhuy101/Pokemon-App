import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FavoriteComponent } from './components/favorite/favorite.component';

export const LANDING_PAGE_ROUTERS: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
  },
];
