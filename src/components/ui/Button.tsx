import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

type SharedProps = {
  variant?: ButtonVariant;
  /** Icon-only usage must reach the 44x44 minimum touch target (DSGN-03). */
  iconOnly?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string;
  };

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-vermillion text-paper hover:opacity-90 dark:bg-vermillion-dark dark:text-ink-dark',
  secondary:
    'bg-secondary text-ink hover:opacity-90 dark:bg-secondary-dark dark:text-ink-dark',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-label font-semibold ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark';

const ICON_ONLY_CLASSES = 'min-h-11 min-w-11 p-0';

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/**
 * Shared Button/link primitive.
 *
 * Security: whenever this renders an external anchor with target="_blank",
 * it ALWAYS adds rel="noopener noreferrer" automatically (reverse-tabnabbing
 * mitigation, T-01-01) — callers never need to remember this themselves.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', iconOnly = false, className = '', children, ...rest } = props;

  const classes = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    iconOnly ? ICON_ONLY_CLASSES : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if ('href' in props && props.href) {
    const { href, target, ...anchorRest } = rest as Omit<ButtonAsLink, keyof SharedProps>;
    const external = isExternalHref(href);

    if (external) {
      const isBlank = target === '_blank';
      return (
        <a
          href={href}
          target={target}
          rel={isBlank ? 'noopener noreferrer' : anchorRest.rel}
          className={classes}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
