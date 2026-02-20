import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServicesComponent,
    SaasComponent,
    PricingComponent,
    KnowledgeBaseComponent,
    ResourcesComponent,
    AiDpaComplianceGuideComponent,
    BuildAiAgentBusinessComponent,
    AiAutomationRoiComponent,
    AiAgentOrchestrationComponent,
    GdprAiComplianceChecklistComponent,
    BusinessAutomationRoadmapComponent,
    ContactComponent,
    OrderComponent,
    SignupComponent,
    DashboardComponent,
    AdminComponent,
    LoginComponent,
    GetStartedComponent,
    PrivacyComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
