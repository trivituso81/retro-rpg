import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ListItem } from '../lib/nav';

export function ListSection({ header, footer, children }: { header?: string; footer?: string; children: ReactNode }) {
  return (
    <section className="list-section">
      {header && <h2 className="list-header">{header}</h2>}
      <div className="list-group">{children}</div>
      {footer && <p className="list-footer">{footer}</p>}
    </section>
  );
}

export function ListLink({ item, icon }: { item: ListItem; icon?: ReactNode }) {
  return (
    <Link to={item.to} className="list-row">
      {icon && <span className="list-row-icon">{icon}</span>}
      <span className="list-row-body">
        <span className="list-row-title">{item.title}</span>
        <span className="list-row-sub">{item.subtitle}</span>
      </span>
      {item.meta && <span className="list-row-meta">{item.meta}</span>}
      <span className="list-chevron" aria-hidden>
        ›
      </span>
    </Link>
  );
}

export function ListButton({
  title,
  subtitle,
  meta,
  onClick,
  danger,
  trailing,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  onClick?: () => void;
  danger?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <button type="button" className={`list-row button ${danger ? 'danger' : ''}`} onClick={onClick}>
      <span className="list-row-body">
        <span className="list-row-title">{title}</span>
        {subtitle && <span className="list-row-sub">{subtitle}</span>}
      </span>
      {meta && <span className="list-row-meta">{meta}</span>}
      {trailing}
    </button>
  );
}

export function ListStatic({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: ReactNode }) {
  return (
    <div className="list-row static">
      <span className="list-row-body">
        <span className="list-row-title">{title}</span>
        {subtitle && <span className="list-row-sub">{subtitle}</span>}
      </span>
      {trailing}
    </div>
  );
}
