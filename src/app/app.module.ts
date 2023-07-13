import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';

import { CustomMaterialModule } from './core/custom-material/custom-material.module'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    RouterModule,
    SharedModule
    
  ],
  exports: [CustomMaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
