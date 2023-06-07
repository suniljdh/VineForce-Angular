import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCountryComponent } from './views/location/country/view-country/view-country.component';


const routes: Routes = [
  {
    path: '',
    component: ViewCountryComponent
  },
  {
    path: 'location',
    loadChildren: () => import('./views/location/location.module').then(m => m.LocationModule)
  },
  {
    path: '**',
    component: ViewCountryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
