/**
 * MORIAH — inline SVG icon set.
 * Emojis signal AI-generated UI; we use crisp line icons instead.
 * All icons inherit `currentColor` and accept standard svg props.
 */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconBag(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconTruck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconLeaf(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c0-7 5-12 14-13 0 9-5 14-12 14a5 5 0 0 1-2-1Z" />
      <path d="M9 16c2-3 4-5 8-7" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function IconHeadset(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13a7 7 0 0 1 14 0" />
      <rect x="3.5" y="13" width="3.5" height="6" rx="1.5" />
      <rect x="17" y="13" width="3.5" height="6" rx="1.5" />
      <path d="M20.5 19a3 3 0 0 1-3 3H13" />
    </svg>
  );
}

export function IconBox(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </svg>
  );
}

export function IconStar(props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.6 1-5.8-4.2-4.1 5.9-.9L12 3.5Z" />
    </svg>
  );
}

export function IconPlus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

export function IconMountain(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 19h18L14 7l-3 5-2-3-6 10Z" />
    </svg>
  );
}

export function IconGift(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11h16v9H4z" />
      <path d="M2 7h20v4H2zM12 7v13" />
      <path d="M12 7S10.5 3.5 8.5 4.2 9 7 12 7Zm0 0s1.5-3.5 3.5-2.8S15 7 12 7Z" />
    </svg>
  );
}

/** Star rating row, rounded to nearest 0.5 isn't needed — pass count of filled */
export function StarRating({rating = 5, count, className = ''}) {
  return (
    <span className={`stars ${className}`}>
      <span className="stars__icons" aria-hidden="true">
        {Array.from({length: 5}).map((_, i) => (
          <IconStar key={i} width={16} height={16} style={{opacity: i < Math.round(rating) ? 1 : 0.25}} />
        ))}
      </span>
      <span className="sr-only">{rating} de 5 estrellas</span>
      {count != null && <span className="stars__count">{count} reseñas</span>}
    </span>
  );
}

/* Brand social icons */
export function IconInstagram(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconWhatsapp(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20l1.4-4A8 8 0 1 1 9 19.6L4 20Z" />
      <path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5.6.1 1.3-.4 1.5-1l-1.5-1-1 .6c-.8-.4-1.4-1-1.8-1.8l.6-1-1-1.5c-.6.2-1.1.9-1 1.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFacebook(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8.5c0-.3.2-.5.5-.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Chevron para menús desplegables (sustituye al carácter "▾"). */
export function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
