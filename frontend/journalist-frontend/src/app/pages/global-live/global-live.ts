import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    Hls: any;
  }
}

interface Channel {
  name: string;
  logo: string;
  url: string;
  country?: string;
}

interface PlayerSlot {
  video: HTMLVideoElement | null;
  hls: any | null;
  channel: Channel | null;
}

@Component({
  selector: 'app-global-live',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-live.html',
  styleUrl: './global-live.scss',
})
export class GlobalLive implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private isBrowser = isPlatformBrowser(this.platformId);

  channels: Channel[] = [];
  filteredChannels: Channel[] = [];

  search = '';
  currentLayout = 1;
  activePlayer = 0;

  loading = false;
  error = '';

  players: PlayerSlot[] = [];

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.setLayout(1);
    await this.ensureHlsLoaded();
    await this.loadChannels();
  }

  ngOnDestroy(): void {
    this.destroyPlayers();
  }

  async ensureHlsLoaded(): Promise<void> {
    if (!this.isBrowser) return;
    if (window.Hls) return;

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-hls="true"]'
      ) as HTMLScriptElement | null;

      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.async = true;
      script.dataset['hls'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load hls.js'));
      document.head.appendChild(script);
    });
  }

  async loadChannels() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    try {
      const res = await fetch('https://iptv-org.github.io/iptv/categories/news.m3u');
      const text = await res.text();

      this.channels = this.parseM3U(text)
        .filter((c) => !!c.url)
        .sort((a, b) => a.name.localeCompare(b.name));

      this.filteredChannels = [...this.channels];
    } catch (e) {
      this.error = 'Unable to load live channels right now.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  parseM3U(data: string): Channel[] {
    const lines = data.split('\n');
    const result: Channel[] = [];
    let current: Partial<Channel> = {};

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (line.startsWith('#EXTINF')) {
        const name = line.split(',').pop()?.trim() || 'Unknown channel';
        const logoMatch = line.match(/tvg-logo="(.*?)"/);
        const countryMatch = line.match(/tvg-country="(.*?)"/);

        current = {
          name,
          logo: logoMatch?.[1] || '',
          country: countryMatch?.[1] || '',
        };
      } else if (line.startsWith('http')) {
        result.push({
          name: current.name || 'Unknown channel',
          logo: current.logo || '',
          country: current.country || '',
          url: line,
        });
        current = {};
      }
    }

    return result;
  }

  onSearchChange() {
    const term = this.search.trim().toLowerCase();

    this.filteredChannels = !term
      ? [...this.channels]
      : this.channels.filter((c) => {
          const haystack = `${c.name} ${c.country || ''}`.toLowerCase();
          return haystack.includes(term);
        });

    this.cdr.detectChanges();
  }

  setLayout(n: number) {
    this.destroyPlayers();

    this.currentLayout = n;
    this.activePlayer = 0;
    this.players = Array.from({ length: n }, () => ({
      video: null,
      hls: null,
      channel: null,
    }));

    this.cdr.detectChanges();
  }

  registerVideo(el: HTMLVideoElement, index: number) {
    if (!this.players[index]) return;
    this.players[index].video = el;
  }

  selectPlayer(index: number) {
    this.activePlayer = index;
  }

  playChannel(channel: Channel) {
    const slot = this.players[this.activePlayer];
    if (!slot?.video) return;

    if (slot.hls) {
      slot.hls.destroy();
      slot.hls = null;
    }

    slot.channel = channel;

    const HlsCtor = window.Hls;

    if (HlsCtor?.isSupported()) {
      const hls = new HlsCtor({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(channel.url);
      hls.attachMedia(slot.video);
      slot.hls = hls;
    } else if (slot.video.canPlayType('application/vnd.apple.mpegurl')) {
      slot.video.src = channel.url;
    } else {
      this.error = 'This browser does not support this stream format.';
    }

    slot.video.play().catch(() => {});
    this.cdr.detectChanges();
  }

  clearSlot(index: number) {
    const slot = this.players[index];
    if (!slot) return;

    if (slot.hls) {
      slot.hls.destroy();
      slot.hls = null;
    }

    if (slot.video) {
      slot.video.pause();
      slot.video.removeAttribute('src');
      slot.video.load();
    }

    slot.channel = null;
    this.cdr.detectChanges();
  }

  private destroyPlayers() {
    this.players.forEach((slot) => {
      if (slot.hls) {
        slot.hls.destroy();
        slot.hls = null;
      }

      if (slot.video) {
        slot.video.pause();
        slot.video.removeAttribute('src');
        slot.video.load();
      }
    });
  }

  trackByChannel(_: number, channel: Channel) {
    return `${channel.name}-${channel.url}`;
  }
}