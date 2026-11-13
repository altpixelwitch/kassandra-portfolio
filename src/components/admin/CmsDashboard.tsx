const sections = [
  {
    description: 'Choose the featured film and update homepage content.',
    href: '/admin/globals/homepage',
    label: 'Home Page',
    symbol: 'home',
  },
  {
    description: 'Add a new film or change an existing one.',
    href: '/admin/collections/works',
    label: 'My Films',
    symbol: 'film',
  },
  {
    description: 'Add a poem, prose, an essay or screenwriting, and publish when ready.',
    href: '/admin/collections/writings',
    label: 'Poetry & Writing',
    symbol: 'writing',
  },
  {
    description: 'Start a new poem or piece of writing straight away.',
    href: '/admin/collections/writings/create',
    label: '+ Add New Writing',
    symbol: 'writing',
  },
  {
    description: 'Add your latest festival selections and awards.',
    href: '/admin/collections/awards',
    label: 'Festivals & Awards',
    symbol: 'award',
  },
  {
    description: 'Share what you have been working on.',
    href: '/admin/collections/news',
    label: 'News',
    symbol: 'news',
  },
  {
    description: 'Update your biography and photograph.',
    href: '/admin/globals/biography',
    label: 'About Me',
    symbol: 'profile',
  },
  {
    description: 'Choose how visitors can contact you.',
    href: '/admin/globals/contact-settings',
    label: 'Contact',
    symbol: 'contact',
  },
  {
    description: 'Upload and reuse photographs and videos.',
    href: '/admin/collections/media',
    label: 'Photos & Videos',
    symbol: 'media',
  },
  {
    description: 'Review website and privacy details.',
    href: '/admin/globals/website-settings',
    label: 'Website Settings',
    symbol: 'settings',
  },
  {
    description:
      'Review account protection, private media, backups, and actions requiring attention.',
    href: '/admin/security',
    label: 'Security & Recovery',
    symbol: 'security',
  },
]

function DashboardIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    award: (
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm4 9v5m-3 0h6M8 6H5v2a3 3 0 0 0 3 3m8-5h3v2a3 3 0 0 1-3 3" />
    ),
    contact: <path d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />,
    film: <path d="M4 6h16v12H4V6Zm4 0v12m8-12v12M4 10h4m8 0h4M4 14h4m8 0h4" />,
    home: <path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4v-9Z" />,
    media: <path d="M4 5h16v14H4V5Zm2 11 4-4 3 3 2-2 3 3M8 9h.01" />,
    news: <path d="M5 4h14v16H5V4Zm3 4h8M8 12h8M8 16h5" />,
    profile: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
    writing: <path d="M5 19h4L19 9l-4-4L5 15v4Zm9-13 4 4M5 21h14" />,
    security: <path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-5" />,
    settings: (
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" />
    ),
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  )
}

export default function CmsDashboard() {
  return (
    <section className="kass-dashboard">
      <header className="kass-dashboard__welcome">
        <p>Private website manager</p>
        <h1>Welcome, Kassandra</h1>
        <span>Choose what you would like to change.</span>
      </header>
      <div className="kass-dashboard__grid">
        {sections.map((section) => (
          <a className="kass-dashboard__card" href={section.href} key={section.href}>
            <span className="kass-dashboard__icon">
              <DashboardIcon name={section.symbol} />
            </span>
            <span>
              <strong>{section.label}</strong>
              <small>{section.description}</small>
            </span>
          </a>
        ))}
      </div>
      <p className="kass-dashboard__workflow">
        Your editing workflow: <strong>Edit</strong> → <strong>Preview</strong> →{' '}
        <strong>Publish</strong>
      </p>
    </section>
  )
}
