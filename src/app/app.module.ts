import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DataImportComponent } from './data-import/data-import.component';
import { WsmMethodComponent } from './wsm-method/wsm-method.component';
import { ChooseMethodComponent } from './choose-method/choose-method.component';
import { AhpMethodComponent } from './ahp-method/ahp-method.component';
import { TopsisMethodComponent } from './topsis-method/topsis-method.component';
import { HomeComponent } from './home/home.component';
import { PrometheeMethodComponent } from './promethee-method/promethee-method.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DataImportComponent,
    WsmMethodComponent,
    ChooseMethodComponent,
    AhpMethodComponent,
    TopsisMethodComponent,
    HomeComponent,    
    PrometheeMethodComponent    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
