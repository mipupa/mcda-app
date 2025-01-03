import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataImportComponent } from './data-import/data-import.component';
import { WsmMethodComponent } from './wsm-method/wsm-method.component';
import { ChooseMethodComponent } from './choose-method/choose-method.component';
import { AhpMethodComponent } from './ahp-method/ahp-method.component';
import { TopsisMethodComponent } from './topsis-method/topsis-method.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [

  { path: 'data-import', component: DataImportComponent },
  { path: 'choose-method', component: ChooseMethodComponent },
  { path: 'wsm-method', component: WsmMethodComponent },
  { path: 'ahp-method', component: AhpMethodComponent },
  { path: 'topsis-method', component: TopsisMethodComponent },
  { path: 'home', component:HomeComponent}
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
