import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { SaasComponent } from './pages/saas/saas.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { KnowledgeBaseComponent } from './pages/knowledge-base/knowledge-base.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { AiDpaComplianceGuideComponent } from './pages/ai-dpa-compliance-guide/ai-dpa-compliance-guide.component';
import { BuildAiAgentBusinessComponent } from './pages/build-ai-agent-business/build-ai-agent-business.component';
import { AiAutomationRoiComponent } from './pages/ai-automation-roi/ai-automation-roi.component';
import { AiAgentOrchestrationComponent } from './pages/ai-agent-orchestration/ai-agent-orchestration.component';
import { GdprAiComplianceChecklistComponent } from './pages/gdpr-ai-compliance-checklist/gdpr-ai-compliance-checklist.component';
import { BusinessAutomationRoadmapComponent } from './pages/business-automation-roadmap/business-automation-roadmap.component';
import { ContactComponent } from './pages/contact/contact.component';
import { OrderComponent } from './pages/order/order.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { GetStartedComponent } from './pages/get-started/get-started.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'saas', component: SaasComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'knowledge-base', redirectTo: 'resources', pathMatch: 'full' },
  { path: 'resources', component: ResourcesComponent },
  { path: 'resources/ai-dpa-compliance-guide', component: AiDpaComplianceGuideComponent },
  { path: 'resources/build-ai-agent-business', component: BuildAiAgentBusinessComponent },
  { path: 'resources/ai-automation-roi', component: AiAutomationRoiComponent },
  { path: 'resources/ai-agent-orchestration', component: AiAgentOrchestrationComponent },
  { path: 'resources/gdpr-ai-compliance-checklist', component: GdprAiComplianceChecklistComponent },
  { path: 'resources/business-automation-roadmap', component: BusinessAutomationRoadmapComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'order', component: OrderComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'get-started', component: GetStartedComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
