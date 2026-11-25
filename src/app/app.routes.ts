import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'NileTronix — Enterprise Technology & Systems Integration',
  },
  {
    path: 'solutions',
    component: HomeComponent,
    title: 'Our Solutions — NileTronix',
  },
  {
    path: 'solutions/:slug',
    loadComponent: () =>
      import(
        './features/solutions/pages/solution-detail-placeholder/solution-detail-placeholder.component'
      ).then((m) => m.SolutionDetailPlaceholderComponent),
    title: 'Enterprise Solution — NileTronix',
  },
  {
    path: 'industries',
    component: HomeComponent,
    title: 'Industries — NileTronix',
  },
  {
    path: 'projects',
    component: HomeComponent,
    title: 'Projects — NileTronix',
  },
  {
    path: 'about',
    component: HomeComponent,
    title: 'About Us — NileTronix',
  },
  {
    path: 'contact',
    component: HomeComponent,
    title: 'Contact — NileTronix',
  },
  {
    path: 'consultation',
    component: HomeComponent,
    title: 'Request a Consultation — NileTronix',
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/legal/legal-page.component').then((m) => m.LegalPageComponent),
    data: { doc: 'privacy' },
    title: 'Privacy Policy — NileTronix',
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./features/legal/legal-page.component').then((m) => m.LegalPageComponent),
    data: { doc: 'terms' },
    title: 'Terms of Service — NileTronix',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found — NileTronix',
  },
];
