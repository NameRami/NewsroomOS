import { Component, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { UsersService } from '../../services/users';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cdr = inject(ChangeDetectorRef);

  name = '';
  bio = '';
  avatarUrl = '';
  location = '';
  website = '';

  loading = false;
  saving = false;
  error = '';

  me: any = null;

  constructor(
    private usersApi: UsersService,
    private auth: AuthService,
    private router: Router
  ) {
    this.me = this.auth.getUser();

    if (this.isBrowser) {
      setTimeout(() => this.loadMe(), 0);
    }
  }

  loadMe() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.usersApi
      .me()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (user) => {
          this.name = user?.name || '';
          this.bio = user?.bio || '';
          this.avatarUrl = user?.avatarUrl || '';
          this.location = user?.location || '';
          this.website = user?.website || '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          const status = err?.status;
          const msg = err?.error?.message || err?.message || 'Failed to load your profile';
          this.error = status ? `(${status}) ${msg}` : msg;
          this.cdr.detectChanges();
        },
      });
  }

  save() {
    if (!this.isBrowser) return;

    this.error = '';
    this.saving = true;
    this.cdr.detectChanges();

    this.usersApi
      .updateMe({
        name: this.name,
        bio: this.bio,
        avatarUrl: this.avatarUrl,
        location: this.location,
        website: this.website,
      })
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (user) => {
          this.auth.setUser(user);
          this.router.navigate(['/profile', user._id]);
        },
        error: (err) => {
          const status = err?.status;
          const msg = err?.error?.message || err?.message || 'Failed to save profile';
          this.error = status ? `(${status}) ${msg}` : msg;
          this.cdr.detectChanges();
        },
      });
  }
}