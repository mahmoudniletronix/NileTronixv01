import { Routes } from '@angular/router';

const loadHomeComponent = () =>
  import('./features/home/home.component').then((m) => m.HomeComponent);

export const routes: Routes = [
  {
    path: '',
    loadComponent: loadHomeComponent,
    title: 'NileTronix — Enterprise Technology & Systems Integration',
  },
  {
    path: 'solutions',
    loadComponent: loadHomeComponent,
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
    loadComponent: loadHomeComponent,
    title: 'Industries — NileTronix',
  },
  {
    path: 'projects',
    loadComponent: loadHomeComponent,
    title: 'Projects — NileTronix',
  },
  {
    path: 'about',
    loadComponent: loadHomeComponent,
    title: 'About Us — NileTronix',
  },
  {
    path: 'contact',
    loadComponent: loadHomeComponent,
    title: 'Contact — NileTronix',
  },
  {
    path: 'consultation',
    loadComponent: loadHomeComponent,
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
