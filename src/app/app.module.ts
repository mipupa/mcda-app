import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { SelectDataComponent } from './select-data/select-data.component';
import { ToastrModule } from 'ngx-toastr';
import { CustomPopupComponent } from './custom-popup/custom-popup.component';
import { UserGuideVideosComponent } from './user-guide-videos/user-guide-videos.component';
import { ReportsComponent } from './reports/reports.component';
import { AboutComponent } from './about/about.component';
import { ContactFormComponent } from './contact-form/contact-form.component';


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
    PrometheeMethodComponent, 
    SelectDataComponent, 
    CustomPopupComponent, 
    UserGuideVideosComponent, 
    ReportsComponent,
    AboutComponent,
    ContactFormComponent    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,    
    ToastrModule.forRoot({ // Globalna konfiguracija Toastr
      timeOut: 3000, // Trajanje obvestila
      preventDuplicates: true,
      progressBar: true, // Omogoči progress bar
      progressAnimation: 'increasing', // Animacija ('increasing' ali 'decreasing')
      
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
