import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VenuesComponent } from './pages/venues/venues.component';
import { UsersComponent } from './pages/users/users.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AddProjectComponent } from './pages/projects/add-project/add-project.component';
import { AddVenueComponent } from './pages/venues/add-venue/add-venue.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { AuthGuard } from './auth/auth.guard'; 
import { UserAccountComponent } from './auth/user-account/user-account.component';
import { SetPasswordComponent } from './pages/users/set-password/set-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'venues',
        component: VenuesComponent,
      },
      {
        path: 'venues/add',
        component: AddVenueComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/add',
        component: AddUserComponent,
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'projects/add',
        component: AddProjectComponent,
      },
      {
        path: 'user-account',
        component: UserAccountComponent,
      },
      {
        path: 'set-password',
        component: SetPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
