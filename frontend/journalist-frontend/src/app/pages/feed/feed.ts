import { Component, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../../services/auth';
import { PostsService, Post } from '../../services/posts';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  user: any = null;

  posts: Post[] = [];
  newPost = '';
  loading = false;
  error = '';

  editingPostId = '';
  editContent = '';
  savingEdit = false;
  deletingPostId = '';

  aiPrompt = '';
  generatingAi = false;

  constructor(
    private auth: AuthService,
    private postsApi: PostsService,
    private router: Router
  ) {
    this.user = this.auth.getUser();

    if (this.isBrowser) {
      setTimeout(() => this.loadPosts(), 0);
    }
  }

  loadPosts() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.postsApi
      .list()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (posts) => {
          this.posts = posts || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          const status = err?.status;
          const msg = err?.error?.message || err?.message || 'Failed to load posts';
          this.error = status ? `(${status}) ${msg}` : msg;
          this.cdr.detectChanges();
        },
      });
  }

  generateAiPost() {
    const prompt = this.aiPrompt.trim();
    if (!prompt) return;

    this.error = '';
    this.generatingAi = true;
    this.cdr.detectChanges();

    this.postsApi.generate(prompt).subscribe({
      next: (res) => {
        this.newPost = res?.content || '';
        this.generatingAi = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Failed to generate AI post';
        this.error = status ? `(${status}) ${msg}` : msg;
        this.generatingAi = false;
        this.cdr.detectChanges();
      },
    });
  }

  createPost() {
    this.error = '';
    const content = this.newPost.trim();
    if (!content) return;

    const tempPost: Post = {
      _id: 'temp-' + Date.now(),
      content,
      createdAt: new Date().toISOString(),
      author: {
        _id: this.user?._id,
        name: this.user?.name,
        email: this.user?.email,
        avatarUrl: this.user?.avatarUrl || '',
      },
      __optimistic: true,
    };

    this.posts = [tempPost, ...this.posts];
    this.newPost = '';
    this.aiPrompt = '';
    this.cdr.detectChanges();

    this.postsApi.create(content).subscribe({
      next: (created) => {
        this.posts = this.posts.map((p) => (p._id === tempPost._id ? created : p));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.posts = this.posts.filter((p) => p._id !== tempPost._id);
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Failed to create post';
        this.error = status ? `(${status}) ${msg}` : msg;
        this.cdr.detectChanges();
      },
    });
  }

  isMyPost(post: Post): boolean {
    return !!this.user?._id && post.author?._id === this.user._id;
  }

  startEdit(post: Post) {
    this.editingPostId = post._id;
    this.editContent = post.content;
    this.error = '';
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingPostId = '';
    this.editContent = '';
    this.error = '';
    this.cdr.detectChanges();
  }

  saveEdit(post: Post) {
    const content = this.editContent.trim();
    if (!content) return;

    this.error = '';
    this.savingEdit = true;
    this.cdr.detectChanges();

    this.postsApi.update(post._id, content).subscribe({
      next: (updated) => {
        this.posts = this.posts.map((p) => (p._id === post._id ? updated : p));
        this.editingPostId = '';
        this.editContent = '';
        this.savingEdit = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Failed to update post';
        this.error = status ? `(${status}) ${msg}` : msg;
        this.savingEdit = false;
        this.cdr.detectChanges();
      },
    });
  }

  deletePost(post: Post) {
    if (!this.isBrowser) return;
    if (!window.confirm('Delete this post?')) return;

    this.error = '';
    this.deletingPostId = post._id;
    this.cdr.detectChanges();

    this.postsApi.delete(post._id).subscribe({
      next: () => {
        this.posts = this.posts.filter((p) => p._id !== post._id);

        if (this.editingPostId === post._id) {
          this.editingPostId = '';
          this.editContent = '';
        }

        this.deletingPostId = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Failed to delete post';
        this.error = status ? `(${status}) ${msg}` : msg;
        this.deletingPostId = '';
        this.cdr.detectChanges();
      },
    });
  }

  trackById(_: number, p: Post) {
    return p._id;
  }

  goMessages() {
    this.router.navigate(['/messages']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  extractUrl(text: string): string | null {
    if (!text) return null;

    const match = text.match(/((https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?)/i);
    if (!match) return null;

    let url = match[0].trim();

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    return url;
  }

  getTextWithoutUrl(text: string): string {
    if (!text) return '';
    return text
      .replace(/((https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?)/gi, '')
      .trim();
  }

  isYoutubeUrl(url: string | null): boolean {
    if (!url) return false;
    return /youtube\.com|youtu\.be/i.test(url);
  }

  goProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  goMyProfile() {
    if (!this.user?._id) return;
    this.router.navigate(['/profile', this.user._id]);
  }

  goEditProfile() {
    this.router.navigate(['/me/edit']);
  }

  getYoutubeEmbedUrl(url: string | null): SafeResourceUrl | null {
    if (!url) return null;

    let videoId: string | null = null;

    const watchMatch = url.match(/[?&]v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);

    if (watchMatch) videoId = watchMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (shortsMatch) videoId = shortsMatch[1];
    else if (embedMatch) videoId = embedMatch[1];

    if (!videoId) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }
}