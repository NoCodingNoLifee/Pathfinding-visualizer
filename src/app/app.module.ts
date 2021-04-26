import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';

import { NavbarComponent } from './shared/components/navbar';
import { MenubarComponent } from './shared/components/menubar';

import { HomeComponent } from './pages/home';
import { AboutComponent } from './pages/about';
import { ExploreComponent } from './pages/explore';
import { GridComponent } from './components/grid/grid.component';

import { VarDirective } from './ng-var.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AboutComponent,
    MenubarComponent,
    ExploreComponent,
    GridComponent,
    VarDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxElectronModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
