'use client';
import type React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled' | 'social' | 'green' | 'orange' | 'grey' | 'yellow' | 'purple';
export type ButtonSize = 'default' | 'small';
export type ButtonAlign = 'center' | 'left' | 'right';

interface BaseProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  align?: ButtonAlign;
  animated?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function getClassNames({ variant, size, align, animated, className }: Pick<BaseProps, 'variant' | 'size' | 'align' | 'animated' | 'className'>) {
  return clsx(
    styles['btn'],
    variant && variant !== 'primary' && styles[variant],
    size === 'small' && styles['small'],
    align && align !== 'center' && styles[`align-${align}`],
    animated && styles['ctaAnimation'],
    className,
  );
}

function Inner({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <>
      <div className={styles['btn-left']} />
      <div className={styles['btn-label']}>
        <span>{label}</span>
        {icon}
      </div>
      <div className={styles['btn-right']} />
    </>
  );
}

export function Button(props: ButtonProps) {
  const { label, variant, size, align, animated, icon, className } = props;
  const classes = getClassNames({ variant, size, align, animated, className });

  if ('href' in props && props.href !== undefined) {
    const { href, target, rel, ...rest } = props as ButtonAsLink;
    void rest;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        <Inner label={label} icon={icon} />
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton & { href?: never };
  void _href;

  return (
    <button
      {...buttonProps}
      disabled={variant === 'disabled' || buttonProps.disabled}
      className={classes}
    >
      <Inner label={label} icon={icon} />
    </button>
  );
}

export default Button;