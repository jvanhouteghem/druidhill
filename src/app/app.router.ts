import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

export const router: Routes = [
    { path: '', redirectTo: 'grid', pathMatch: 'full' },
    { path: 'grid', component: GridComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);