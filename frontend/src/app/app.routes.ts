import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { RoutesComponent } from './Pages/routes/routes.component';
import { LoginComponent } from './Pages/login/login.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { VerifyOtpComponent } from './Pages/verify-otp/verify-otp.component';
import { StockTableComponent } from './Pages/stock-table/stock-table.component';
import { CardComponent } from './Pages/card/card.component';
import { WishlistComponent } from './Pages/wishlist/wishlist.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { PortfolioComponent } from './Pages/portfolio/portfolio.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { ChatBotAiComponent } from './Pages/chat-bot-ai/chat-bot-ai.component';
import { ProfileComponent } from './Pages/profile-component/profile-component';
import { ContactUsComponent } from './Pages/contact-us/contact-us.component';

export const routes: Routes = [
  { path: '', component: RoutesComponent },
  { path: 'login', component: LoginComponent,canActivate: [LoginGuard]},
  { path: 'signup', component: SignupComponent,canActivate: [LoginGuard] },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'stock', component: StockTableComponent },
  { path: 'stock/:id', component: CardComponent },
  { path: 'wishlist', component: WishlistComponent,canActivate: [AuthGuard] },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'portfolio', component: PortfolioComponent,canActivate: [AuthGuard] },
  {path: 'bot', component: ChatBotAiComponent },
  {path: 'profile', component: ProfileComponent },
  {path: 'contact-us', component: ContactUsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
