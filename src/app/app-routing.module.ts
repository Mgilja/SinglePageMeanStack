import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthguardService } from './authguard.service';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path:'create', component: PostCreateComponent, canActivate:[AuthguardService] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate:[AuthguardService] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class AppRoutingModule { }
