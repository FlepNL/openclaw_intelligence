import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { SaasComponent } from './pages/saas/saas.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { KnowledgeBaseComponent } from './pages/knowledge-base/knowledge-base.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'saas', component: SaasComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'knowledge-base', component: KnowledgeBaseComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
