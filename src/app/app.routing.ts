import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
  // Landing routes
  {
    path: '', component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: '', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
    ]
  },
  // Error routes
  {
    path: '404', component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: '', loadChildren: () => import('app/modules/error/error-404/error-404.module').then(m => m.Error404Module) },
    ]
  },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'ideas' },
  // Auth routes for guests
  {
    path: '',
    // canActivate: [NoAuthGuard],
    // canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)
      },
      {
        path: 'reset-password',
        loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)
      },
      {
        path: 'sign-in',
        loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
      },
      {
        path: 'sign-up',
        loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)
      }
    ]
  },
  // Auth routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty'
    },
    children: [
      {
        path: 'complete-profile',
        loadChildren: () => import('app/modules/auth/complete-profile/complete-profile.module').then(m => m.CompleteProfileModule)
      },
      {
        path: 'sign-out',
        loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)
      },
      {
        path: 'unlock-session',
        loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)
      }
    ]
  },
  // Admin routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'dreamfeeds',
        loadChildren: () => import('app/modules/common/dreamfeeds/dreamfeeds.module').then(m => m.DreamfeedsModule)
      },
      {
        path: 'ideas',
        loadChildren: () => import('app/modules/common/ideas/ideas.module').then(m => m.IdeasModule)
      },
      {
        path: 'inspirations',
        loadChildren: () => import('app/modules/common/inspirations/inspirations.module').then(m => m.InspirationsModule)
      }
    ]
  },
  {
    path: '**', pathMatch: 'full', redirectTo: '404'
  }
];
