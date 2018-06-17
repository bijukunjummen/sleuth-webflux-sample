import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PassthroughComponent} from "./components/passthrough/passthrough.component";

const routes: Routes = [
  {path: 'passform', component: PassthroughComponent},
  { path: '', component: PassthroughComponent },
  { path: '*', component: PassthroughComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

