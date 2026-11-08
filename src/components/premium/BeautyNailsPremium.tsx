'use client';

import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './beauty-nails-exact.css';
import { useLocale } from '../../i18n/LocaleContext';

/**
 * These components display the approved raster atlas. They never redraw an icon.
 * Copy assets/icon-atlas.png to public/beauty-nails-premium/icon-atlas.png,
 * or supply the actual public directory through assetBase.
 */
export type PremiumIconName =
  | 'diamond'
  | 'lotus'
  | 'heart'
  | 'sparkle'
  | 'leaf'
  | 'lashes'
  | 'lips'
  | 'clock';

export type FeatureSetKind = 'hero' | 'nails' | 'lashes' | 'makeup';
export type PremiumIconTone = 'dark' | 'rose';

const DEFAULT_ASSET_BASE = '/beauty-nails-premium';

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function atlasCssUrl(assetBase: string) {
  const base = assetBase.replace(/\/+$/, '');
  const source = `${base}/icon-atlas.png`;
  // A quoted CSS URL also handles public directory names containing spaces.
  return `url("${encodeURI(source).replace(/"/g, '%22')}")`;
}

/** Pause only decorative motion; never hide or remove the actual content. */
function useMotionPause<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;

    const update = () => {
      const paused = !enabled || reducedMotion.matches || document.hidden || !visible;
      element.setAttribute('data-bnx-paused', paused ? 'true' : 'false');
    };

    const observer =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries.find((item) => item.target === element);
              if (!entry) return;
              visible = entry.isIntersecting;
              update();
            },
            { threshold: 0.01 },
          )
        : null;

    observer?.observe(element);
    document.addEventListener('visibilitychange', update);
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', update);
    } else {
      reducedMotion.addListener(update);
    }
    update();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      if (typeof reducedMotion.removeEventListener === 'function') {
        reducedMotion.removeEventListener('change', update);
      } else {
        reducedMotion.removeListener(update);
      }
    };
  }, [enabled]);

  return ref;
}

export interface PremiumIconProps {
  name: PremiumIconName;
  size?: number | string;
  tone?: PremiumIconTone;
  animated?: boolean;
  assetBase?: string;
  className?: string;
}

type IconStyle = CSSProperties & {
  '--bnx-size'?: string;
  '--bnx-atlas': string;
};

/** Decorative artwork: the adjacent visible label supplies its meaning. */
export function PremiumIcon({
  name,
  size,
  tone = 'dark',
  animated = true,
  assetBase = DEFAULT_ASSET_BASE,
  className,
}: PremiumIconProps) {
  const style: IconStyle = { '--bnx-atlas': atlasCssUrl(assetBase) };
  if (typeof size === 'number' && Number.isFinite(size) && size > 0) {
    style['--bnx-size'] = `${size}px`;
  } else if (typeof size === 'string' && size.trim()) {
    style['--bnx-size'] = size;
  }

  return (
    <span
      className={classes('bnx-icon', `bnx-icon--${name}`, `bnx-icon--${tone}`, className)}
      style={style}
      data-name={name}
      data-bnx-animated={animated ? 'true' : 'false'}
      data-bnx-paused={animated ? undefined : 'true'}
      role="presentation"
      aria-hidden="true"
    >
      <span className="bnx-icon__art" aria-hidden="true" />
      <span className="bnx-icon__glint" aria-hidden="true" />
    </span>
  );
}

interface Feature {
  name: PremiumIconName;
  label: string;
  lines?: readonly [string, string];
}

const FEATURES: Record<FeatureSetKind, readonly Feature[]> = {
  hero: [
    { name: 'diamond', label: 'Premium Deneyim', lines: ['Premium', 'Deneyim'] },
    { name: 'lotus', label: 'Uzman Ekip', lines: ['Uzman', 'Ekip'] },
    { name: 'heart', label: 'Size Özel Bakım', lines: ['Size Özel', 'Bakım'] },
  ],
  nails: [
    { name: 'sparkle', label: 'Kişiye özel tasarım' },
    { name: 'diamond', label: 'Uzun ömürlü uygulama' },
    { name: 'leaf', label: 'Sağlıklı tırnak bakımı' },
  ],
  lashes: [
    { name: 'lashes', label: 'Doğal görünüm' },
    { name: 'leaf', label: 'Hafif ve konforlu' },
    { name: 'heart', label: 'Uzman uygulama' },
  ],
  makeup: [
    { name: 'lips', label: 'Doğal ve estetik sonuçlar' },
    { name: 'sparkle', label: 'Yüzünüze uygun tasarım' },
    { name: 'clock', label: 'Uzun süre kalıcı etki' },
  ],
};

export interface FeatureSetProps {
  kind: FeatureSetKind;
  className?: string;
  assetBase?: string;
  animated?: boolean;
}

export function FeatureSet({
  kind,
  className,
  assetBase = DEFAULT_ASSET_BASE,
  animated = true,
}: FeatureSetProps) {
  const { locale, t } = useLocale();
  const ref = useMotionPause<HTMLUListElement>(animated);
  const tone = kind === 'hero' || kind === 'lashes' ? 'dark' : 'rose';

  return (
    <ul
      ref={ref}
      className={classes('bnx-features', `bnx-features--${kind}`, className)}
      data-bnx-motion=""
      data-bnx-paused="true"
    >
      {FEATURES[kind].map((feature) => (
        <li className="bnx-feature" key={feature.name}>
          <PremiumIcon
            name={feature.name}
            tone={tone}
            animated={animated}
            assetBase={assetBase}
          />
          <span className="bnx-feature__label">
            {locale === 'tr' && feature.lines ? (
              <>
                <span>{feature.lines[0]}</span>{' '}
                <span>{feature.lines[1]}</span>
              </>
            ) : (
              t(feature.label)
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export interface PremiumNavItem {
  label: string;
  href: string;
}

export interface PremiumNavProps {
  items: readonly PremiumNavItem[];
  currentHref?: string;
  className?: string;
  assetBase?: string;
  label?: string;
}

export function PremiumNav({
  items,
  currentHref,
  className,
  assetBase = DEFAULT_ASSET_BASE,
  label,
}: PremiumNavProps) {
  const { t } = useLocale();
  const ref = useMotionPause<HTMLElement>(true);

  return (
    <nav
      ref={ref}
      className={classes('bnx-nav', className)}
      aria-label={label ?? t('Üst navigasyon')}
      data-bnx-motion=""
      data-bnx-paused="true"
    >
      {items.map((item) => {
        const active = currentHref !== undefined && item.href === currentHref;
        const current = active ? (item.href.includes('#') ? 'location' : 'page') : undefined;

        return (
          <a
            key={`${item.href}:${item.label}`}
            href={item.href}
            className={classes('bnx-nav__link', active && 'bnx-nav__link--active')}
            aria-current={current}
          >
            {active && (
              <span className="bnx-nav__gem" aria-hidden="true">
                <PremiumIcon name="diamond" size={18} animated={false} assetBase={assetBase} />
              </span>
            )}
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

export interface PremiumAppointmentProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'> {
  href: string;
  children?: ReactNode;
  assetBase?: string;
  className?: string;
  compact?: boolean;
}

export function PremiumAppointment({
  href,
  children,
  assetBase = DEFAULT_ASSET_BASE,
  className,
  compact = false,
  ...anchorProps
}: PremiumAppointmentProps) {
  const { t } = useLocale();
  const ref = useMotionPause<HTMLAnchorElement>(true);

  return (
    <a
      {...anchorProps}
      ref={ref}
      href={href}
      className={classes('bnx-appointment', compact && 'bnx-appointment--compact', className)}
      data-bnx-motion=""
      data-bnx-paused="true"
    >
      <span className="bnx-appointment__gem" aria-hidden="true">
        <PremiumIcon name="diamond" size={32} assetBase={assetBase} />
      </span>
      <span className="bnx-appointment__label">{children ?? t('Özel Randevu')}</span>
      <span className="bnx-appointment__orb" aria-hidden="true">
        <svg
          className="bnx-appointment__arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
          aria-hidden="true"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </span>
    </a>
  );
}
