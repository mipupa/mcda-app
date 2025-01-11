import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataImportComponent } from './data-import/data-import.component';
import { WsmMethodComponent } from './wsm-method/wsm-method.component';
import { ChooseMethodComponent } from './choose-method/choose-method.component';
import { AhpMethodComponent } from './ahp-method/ahp-method.component';
import { TopsisMethodComponent } from './topsis-method/topsis-method.component';
import { HomeComponent } from './home/home.component';
import { PrometheeMethodComponent } from './promethee-method/promethee-method.component';
import { SelectDataComponent } from './select-data/select-data.component';
import { UserGuideVideosComponent } from './user-guide-videos/user-guide-videos.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [

  { path: 'data-import', component: DataImportComponent },
  { path: 'select-data', component: SelectDataComponent },
  { path: 'choose-method', component: ChooseMethodComponent },
  { path: 'wsm-method', component: WsmMethodComponent },
  { path: 'ahp-method', component: AhpMethodComponent },
  { path: 'topsis-method', component: TopsisMethodComponent },
  { path: 'promethee-method', component: PrometheeMethodComponent },
  { path: 'user-guide-videos', component: UserGuideVideosComponent },
  { path: 'analysis-reports', component: ReportsComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
