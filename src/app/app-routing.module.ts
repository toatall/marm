import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { canAuth } from './guards/auth.guard';
import { FlComponent } from './fl/fl.component';
import { UlComponent } from './ul/ul.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [canAuth] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [canAuth] },
  { path: 'fl', component: FlComponent, canActivate: [canAuth] },
  { path: 'ul', component: UlComponent, canActivate: [canAuth] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
