import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SoldiersComponent } from './soldiers/soldiers.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [


  /*Shopping List*/
  /*Mobile*/
  {path: 'homepage',component: HomepageComponent},
  {path: 'soldiers',component: SoldiersComponent},
  {path: 'services',component: ServicesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
