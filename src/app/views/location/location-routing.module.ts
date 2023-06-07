import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewStateComponent } from './state/view-state/view-state.component';
import { ViewCountryComponent } from './country/view-country/view-country.component';

const routes: Routes = [
  {
    path: 'view-country',
    component: ViewCountryComponent
  },
  {
    path: 'view-state',
    component: ViewStateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
