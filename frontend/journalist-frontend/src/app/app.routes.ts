import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

import { Login } from './pages/login/login';
import { Feed } from './pages/feed/feed';
import { Messages } from './pages/messages/messages';
import { Profile } from './pages/profile/profile';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { GlobalLive } from './pages/global-live/global-live';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: Login },

  { path: 'feed', component: Feed, canActivate: [AuthGuard] },
  { path: 'messages', component: Messages, canActivate: [AuthGuard] },
  { path: 'global-live', component: GlobalLive, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: Profile, canActivate: [AuthGuard] },
  { path: 'me/edit', component: EditProfile, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' }
];