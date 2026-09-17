import { Component, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UsersService, UserProfile } from '../../services/users';
import { Post } from '../../services/posts';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cdr = inject(ChangeDetectorRef);

  profile: UserProfile | null = null;
  posts: Post[] = [];
  loading = false;
  error = '';
  me: any = null;

  constructor(
    private route: ActivatedRoute,
    private usersApi: UsersService,
    private auth: AuthService,
    private router: Router
  ) {
    this.me = this.auth.getUser();

    if (this.isBrowser) {
      setTimeout(() => this.loadProfile(), 0);
    }
  }

  loadProfile() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Missing profile id';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    forkJoin({
      profile: this.usersApi.getProfile(id).pipe(
        catchError((err) => {
          const status = err?.status;
          const msg = err?.error?.message || err?.message || 'Failed to load profile';
          this.error = status ? `(${status}) ${msg}` : msg;
          return of(null);
        })
      ),
      posts: this.usersApi.getUserPosts(id).pipe(
        catchError(() => of([]))
      ),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ profile, posts }) => {
          this.profile = profile;
          this.posts = posts || [];
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Failed to load profile';
          this.cdr.detectChanges();
        },
      });
  }

  isMe(): boolean {
    return !!this.profile?._id && this.profile._id === this.me?._id;
  }

  goEdit() {
    this.router.navigate(['/me/edit']);
  }
}