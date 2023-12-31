import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VenuesComponent } from './pages/venues/venues.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UsersComponent } from './pages/users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AssignRolesComponent } from './pages/users/assign-roles/assign-roles.component';
import { SetPasswordComponent } from './pages/users/set-password/set-password.component';
import { AddProjectComponent } from './pages/projects/add-project/add-project.component';
import { AddVenueComponent } from './pages/venues/add-venue/add-venue.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './utils/loader/loader.component';
import { HttpRequestInterceptor } from './http-request-interceptor';
import { LoaderService } from './utils/loader/loader.service';
import { AuthService } from './auth/auth.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { EditProjectDialogComponent } from './components/edit-project-dialog/edit-project-dialog.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { MatSelectModule } from '@angular/material/select';
export function initializeAppFactory(authService: AuthService) {
  return () => authService.whoami();
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    VenuesComponent,
    ProjectsComponent,
    LayoutComponent,
    UsersComponent,
    AddUserComponent,
    AddProjectComponent,
    AssignRolesComponent,
    SetPasswordComponent,
    AddProjectComponent,
    AddVenueComponent,
    LoaderComponent,
    EditUserDialogComponent,
    EditProjectDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDividerModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  providers: [
    LoaderService,
    {
      provide: APP_INITIALIZER, useFactory: initializeAppFactory,
      deps: [AuthService], multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
