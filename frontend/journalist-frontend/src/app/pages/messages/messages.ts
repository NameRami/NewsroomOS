import { Component, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, timer, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { MessagesService, UserLite, Thread } from '../../services/messages';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages implements OnDestroy {
  me: any = null;

  query = '';
  results: UserLite[] = [];

  threads: Thread[] = [];              // ✅ NEW
  threadsLoading = false;              // ✅ NEW

  selected: UserLite | null = null;
  conversation: any[] = [];
  body = '';
  error = '';

  private pollSub?: Subscription;
  private threadsSub?: Subscription;   // ✅ NEW
  private cdr = inject(ChangeDetectorRef);

  constructor(private api: MessagesService, private auth: AuthService) {
    this.me = this.auth.getUser();

    // ✅ load threads once immediately
    this.loadThreads();

    // ✅ refresh threads every 5s (so last message updates)
    this.threadsSub = timer(5000, 5000)
      .pipe(
        switchMap(() => this.api.threads()),
        catchError(() => EMPTY)
      )
      .subscribe((t: any) => {
        this.threads = t || [];
        this.cdr.detectChanges();
      });

    // ✅ Poll messages every 2s, starting immediately.
    this.pollSub = timer(0, 2000)
      .pipe(
        switchMap(() => {
          if (!this.selected) return EMPTY;
          return this.api.conversationWith(this.selected._id).pipe(
            catchError(() => EMPTY)
          );
        })
      )
      .subscribe((msgs: any) => {
        this.conversation = msgs || [];
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
    this.threadsSub?.unsubscribe();
  }

  loadThreads() {
    this.threadsLoading = true;
    this.api.threads().subscribe({
      next: (t) => {
        this.threads = t || [];
        this.threadsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.threadsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  search() {
    const q = this.query.trim();
    if (!q) {
      this.results = [];
      return;
    }

    this.api.searchUsers(q).subscribe({
      next: (users) => {
        this.results = users;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Search failed';
        this.cdr.detectChanges();
      },
    });
  }

  selectUser(u: UserLite) {
    this.selected = u;
    this.results = [];
    this.query = `${u.name} (${u.email})`;

    this.loadConversation();
  }

  // ✅ NEW: click thread user
  selectThread(th: Thread) {
    this.selectUser(th.user);
  }

  loadConversation() {
    if (!this.selected) return;

    this.api.conversationWith(this.selected._id).subscribe({
      next: (msgs) => {
        this.conversation = msgs || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load conversation';
        this.cdr.detectChanges();
      },
    });
  }

  send() {
    this.error = '';
    if (!this.selected) {
      this.error = 'Select a user first';
      this.cdr.detectChanges();
      return;
    }

    const text = this.body.trim();
    if (!text) return;

    const tempMsg: any = {
      _id: 'temp-' + Date.now(),
      body: text,
      createdAt: new Date().toISOString(),
      from: { _id: this.me?._id, name: this.me?.name, email: this.me?.email },
      to: { _id: this.selected._id, name: this.selected.name, email: this.selected.email },
      __optimistic: true,
    };

    this.conversation = [...this.conversation, tempMsg];
    this.body = '';
    this.cdr.detectChanges();

    this.api.send(this.selected._id, text).subscribe({
      next: () => {
        this.loadConversation();
        this.loadThreads(); // ✅ update sidebar instantly after sending
      },
      error: (err) => {
        this.conversation = this.conversation.filter((m) => m._id !== tempMsg._id);
        this.error = err?.error?.message || 'Send failed';
        this.cdr.detectChanges();
      },
    });
  }

  isMine(m: any) {
    return m?.from?._id === this.me?._id;
  }
}
