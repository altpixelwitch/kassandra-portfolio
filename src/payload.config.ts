import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Awards } from './collections/Awards'
import { ContactMessages } from './collections/ContactMessages'
import { Folders } from './collections/Folders'
import { LegalPages } from './collections/LegalPages'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { PrivateMedia } from './collections/PrivateMedia'
import { Tags } from './collections/Tags'
import { Works } from './collections/Works'
import { WritingFiles } from './collections/WritingFiles'
import { Writings } from './collections/Writings'
import { Biography } from './globals/Biography'
import { ContactSettings } from './globals/ContactSettings'
import { Homepage } from './globals/Homepage'
import { WebsiteSettings } from './globals/WebsiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function requireEnvironmentVariable(name: 'DATABASE_URL' | 'PAYLOAD_SECRET') {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required. See RAILWAY-DEPLOY.md.`)
  return value
}

const publicURL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : 'http://localhost:3000')

export default buildConfig({
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    components: {
      beforeDashboard: ['/components/admin/CmsDashboard'],
      views: {
        security: {
          Component: '/components/admin/SecurityOverview',
          path: '/security',
        },
      },
    },
    dashboard: {
      widgets: [],
      defaultLayout: [{ widgetSlug: 'activity', width: 'full' }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [publicURL],
  csrf: [publicURL],
  db: postgresAdapter({
    pool: {
      connectionString: requireEnvironmentVariable('DATABASE_URL'),
    },
  }),
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [
    Admins,
    Media,
    PrivateMedia,
    Folders,
    Tags,
    Works,
    Writings,
    WritingFiles,
    Awards,
    News,
    LegalPages,
    ContactMessages,
  ],
  globals: [Homepage, Biography, ContactSettings, WebsiteSettings],
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  secret: requireEnvironmentVariable('PAYLOAD_SECRET'),
  serverURL: publicURL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
