"use client";

// Last line of defence: replaces the whole page if even the layout fails
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "6rem 1rem" }}>
        <h1 style={{ fontSize: "1.75rem" }}>Something went wrong</h1>
        <p style={{ color: "#475569", maxWidth: "28rem", margin: "1rem auto" }}>Your files were not uploaded anywhere. Please try again.</p>
        <button onClick={reset} style={{ background: "#0062cc", color: "white", border: 0, borderRadius: "0.75rem", padding: "0.9rem 1.5rem", fontWeight: 700, cursor: "pointer" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
