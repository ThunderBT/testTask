import { EditImageItemComponent } from './components/edit-image-item/edit-image-item.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridViewComponent } from './components/grid-view/grid-view.component';
import { ImageDetailsComponent } from './components/image-details/image-details.component';


const routes: Routes = [
  { path: 'add-image', component: EditImageItemComponent },
  { path: 'edit-image/:id', component: EditImageItemComponent },
  { path: 'details/:id', component: ImageDetailsComponent },
  { path: '', component: GridViewComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
