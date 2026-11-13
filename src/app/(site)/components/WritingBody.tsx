import type { CSSProperties, ReactNode } from 'react'
import type { LexicalNode } from '@/lib/writings'

/* Shows Kassandra's writing exactly as she wrote it in the editor: every line
   break, empty line between stanzas, indent, italic and bold is kept. Nothing
   is reworded, reflowed or corrected. Text is always inserted as plain text
   (never as HTML), and links are allowed only to ordinary web or email
   addresses, so nothing typed into the editor can run as code on the page. */

const BOLD = 1
const ITALIC = 2
const STRIKETHROUGH = 4
const UNDERLINE = 8
const CODE = 16
const SUBSCRIPT = 32
const SUPERSCRIPT = 64

const safeHref = (value: unknown) => {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value, 'https://example.invalid')
    if (url.origin === 'https://example.invalid') return null
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

const alignment = (format: LexicalNode['format']) =>
  typeof format === 'string' && ['center', 'right', 'justify', 'start', 'end'].includes(format)
    ? (format as 'center' | 'end' | 'justify' | 'right' | 'start')
    : undefined

/* An indent is passed to the stylesheet as a number, so it adds to the
   spacing a line already has rather than replacing it */
const blockStyle = (node: LexicalNode): CSSProperties | undefined => {
  const indent = typeof node.indent === 'number' && node.indent > 0 ? Math.min(node.indent, 10) : 0
  const textAlign = alignment(node.format)
  if (!indent && !textAlign) return undefined
  return {
    ...(indent ? ({ '--indent': indent } as CSSProperties) : {}),
    ...(textAlign ? { textAlign } : {}),
  }
}

function renderText(node: LexicalNode, key: number) {
  let content: ReactNode = node.text ?? ''
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & CODE) content = <code>{content}</code>
  if (format & SUBSCRIPT) content = <sub>{content}</sub>
  if (format & SUPERSCRIPT) content = <sup>{content}</sup>
  if (format & STRIKETHROUGH) content = <s>{content}</s>
  if (format & UNDERLINE) content = <u>{content}</u>
  if (format & ITALIC) content = <em>{content}</em>
  if (format & BOLD) content = <strong>{content}</strong>
  return <span key={key}>{content}</span>
}

function renderChildren(nodes: LexicalNode[] | undefined, verse = false): ReactNode[] {
  return (nodes ?? []).map((node, index) => renderNode(node, index, verse))
}

/* In a poem, a line break made with Shift + Enter starts a new line of the
   poem, so each one is shown as its own line (a long line that has to wrap
   on a small screen then wraps neatly under itself) */
function renderVerseLines(nodes: LexicalNode[] | undefined): ReactNode[] {
  const lines: LexicalNode[][] = [[]]
  for (const node of nodes ?? []) {
    if (node.type === 'linebreak') lines.push([])
    else lines[lines.length - 1].push(node)
  }
  return lines.map((line, index) => (
    <span className="writing__line" key={index}>
      {line.length > 0 ? renderChildren(line, true) : '\u00a0'}
    </span>
  ))
}

function hasVisibleText(node: LexicalNode): boolean {
  if (node.type === 'text') return Boolean(node.text)
  if (node.type === 'tab') return true
  return (node.children ?? []).some(hasVisibleText)
}

function renderNode(node: LexicalNode, key: number, verse = false): ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'tab':
      return <span key={key}>{'\t'}</span>
    case 'paragraph': {
      // An empty line is kept as a blank line, so stanza spacing survives
      const empty = !(node.children ?? []).some(hasVisibleText)
      return (
        <p className={empty ? 'writing__blank' : undefined} key={key} style={blockStyle(node)}>
          {empty ? '\u00a0' : verse ? renderVerseLines(node.children) : renderChildren(node.children)}
        </p>
      )
    }
    case 'heading': {
      const Tag = (['h2', 'h3', 'h4'].includes(node.tag ?? '') ? node.tag : 'h3') as
        | 'h2'
        | 'h3'
        | 'h4'
      return (
        <Tag key={key} style={blockStyle(node)}>
          {renderChildren(node.children)}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote key={key} style={blockStyle(node)}>
          {renderChildren(node.children)}
        </blockquote>
      )
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={key} style={blockStyle(node)}>
          {renderChildren(node.children)}
        </Tag>
      )
    }
    case 'listitem':
      return (
        <li key={key} style={blockStyle(node)}>
          {renderChildren(node.children)}
        </li>
      )
    case 'link':
    case 'autolink': {
      const href = safeHref(node.fields?.url ?? node.url)
      if (!href) return <span key={key}>{renderChildren(node.children)}</span>
      return (
        <a href={href} key={key} rel="noopener noreferrer" target="_blank">
          {renderChildren(node.children)}
        </a>
      )
    }
    case 'horizontalrule':
      return <hr key={key} />
    default:
      // Anything else the editor may add is shown as its plain text
      return node.children ? <span key={key}>{renderChildren(node.children)}</span> : null
  }
}

export default function WritingBody({
  body,
  poetry,
}: {
  body?: { root?: LexicalNode } | null
  poetry: boolean
}) {
  const nodes = body?.root?.children ?? []
  if (nodes.length === 0) return null
  return (
    <div
      className={`writing__body notranslate ${poetry ? 'writing__body--verse' : 'writing__body--prose'}`}
      translate="no"
    >
      {renderChildren(nodes, poetry)}
    </div>
  )
}
