'use client'

export default function GlobalError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: 'center',
            background: '#151311',
            color: '#efe8dd',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'serif',
            gap: '20px',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <h1>Something went wrong</h1>
          <p>Please try loading Kassandra&apos;s portfolio again.</p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              border: '1px solid #50c878',
              color: '#efe8dd',
              padding: '10px 18px',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
