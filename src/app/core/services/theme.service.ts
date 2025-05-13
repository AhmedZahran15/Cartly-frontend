import {
  Injectable,
  signal,
  effect,
  inject,
  PLATFORM_ID,
  DestroyRef,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, fromEvent } from 'rxjs';

type Theme = 'light' | 'dark' | 'system';
const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly themeSignal = signal<Theme>(this.getInitialTheme());
  readonly theme = this.themeSignal.asReadonly();

  // System theme detection
  private systemThemeMatcher: MediaQueryList | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setupThemeEffect();
    this.setupSystemThemeListener();
  }

  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';

    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : 'system';
  }

  private setupThemeEffect(): void {
    effect(() => {
      const theme = this.theme();
      const isDark = this.resolveDarkMode(theme);

      this.applySystemTheme(isDark);

      if (theme !== 'system') {
        localStorage.setItem(THEME_KEY, theme);
      } else {
        localStorage.removeItem(THEME_KEY);
      }
    });
  }

  private setupSystemThemeListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.systemThemeMatcher = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );
      const listener = (event: MediaQueryListEvent) => {
        if (this.theme() === 'system') {
          this.applySystemTheme(event.matches);
        }
      };
      fromEvent<MediaQueryListEvent>(this.systemThemeMatcher, 'change')
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            console.error('Theme listener error:', error);
            return EMPTY;
          })
        )
        .subscribe(listener);
      this.applySystemTheme(this.systemThemeMatcher.matches);
    } catch (error) {
      console.error('Failed to initialize system theme listener:', error);
      this.applySystemTheme(false);
    }
  }

  private resolveDarkMode(theme: Theme): boolean {
    return (
      theme === 'dark' ||
      (theme === 'system' && !!this.systemThemeMatcher?.matches)
    );
  }

  private applySystemTheme(isDark: boolean): void {
    const classList = this.document.documentElement.classList;
    isDark ? classList.add('my-app-dark') : classList.remove('my-app-dark');
  }
  /**
   * Sets the current theme for the application.
   *
   * @param theme - The theme to be applied ('light', 'dark', or 'system')
   * @throws {Error} If the theme is invalid or cannot be applied
   * @example
   * ```typescript
   * themeService.setTheme('dark');
   * ```
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  /**
   * Toggles the theme between 'dark', 'light', and 'system' options.
   * The theme cycles in the following order: dark -> light -> system -> dark.
   * This method updates the themeSignal with the new theme value.
   * @returns void
   */
  toggleTheme(): void {
    this.themeSignal.update((current) =>
      current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark'
    );
  }
}
