import { DefaultTemplate } from '@payloadcms/ui/rsc'
import type { AdminViewServerProps } from 'payload'
import styles from './SecurityOverview.module.css'

const checks = [
  {
    detail:
      'The administration area and draft previews require an authorised Figma/Payload administrator session.',
    label: 'Administrator access',
    status: 'Protected',
    tone: 'good',
  },
  {
    detail:
      'Multi-factor authentication is controlled by the Figma account used to access Make. Enable a passkey or authenticator in that account.',
    label: 'Two-factor authentication',
    status: 'Check your Figma account',
    tone: 'attention',
  },
  {
    detail:
      'Payload version history and Make code versions are available. The hosting platform does not expose a verified backup timestamp here.',
    label: 'Backups',
    status: 'Platform status unavailable',
    tone: 'attention',
  },
  {
    detail:
      'Recent administrator sign-in records are managed by the Figma authentication platform and are not exposed to this website.',
    label: 'Recent sign-ins',
    status: 'View in account security',
    tone: 'neutral',
  },
  {
    detail:
      'Private Films & Materials uses administrator-only access and private, no-store file responses.',
    label: 'Private media',
    status: 'Protected',
    tone: 'good',
  },
]

export default function SecurityOverview(props: AdminViewServerProps) {
  return (
    <DefaultTemplate
      {...props}
      className={styles.security}
      visibleEntities={props.initPageResult.visibleEntities}
    >
      <header className={styles.header}>
        <p>Security &amp; recovery</p>
        <h1>What needs your attention</h1>
        <span>This page reports only controls the website can genuinely verify.</span>
      </header>
      <div className={styles.checks}>
        {checks.map((check) => (
          <article className={styles.check} data-tone={check.tone} key={check.label}>
            <div>
              <p>{check.label}</p>
              <strong>{check.status}</strong>
            </div>
            <span>{check.detail}</span>
          </article>
        ))}
      </div>
      <section className={styles.actions}>
        <h2>Recommended account actions</h2>
        <ol>
          <li>Enable a Figma passkey or authenticator-based multi-factor authentication.</li>
          <li>Review authorised Figma sessions and remove devices you do not recognise.</li>
          <li>Keep unpublished films in Private Films &amp; Materials, not Photos &amp; Videos.</li>
          <li>Review contact messages at their deletion-review date.</li>
          <li>Confirm platform backup and restoration options before a major content migration.</li>
        </ol>
      </section>
    </DefaultTemplate>
  )
}
