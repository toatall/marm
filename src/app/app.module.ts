import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { FlComponent } from './fl/fl.component';
import { NotifierModule } from 'angular-notifier';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ProfileComponent,
        FlComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        NotifierModule.withConfig({ position: { horizontal: { position: 'right' } }}),
        FontAwesomeModule,
    ],
    providers: [httpInterceptorProviders],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas, far, fab);
    }

}
