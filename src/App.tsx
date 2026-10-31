import { useEffect, useState } from 'react';

type Greeting = {
  eyebrow: string;
  title: string;
  message: string;
  source: string;
};

function isGreeting(value: unknown): value is Greeting {
  return typeof value === 'object' && value !== null &&
    ['eyebrow', 'title', 'message', 'source'].every(
      (key) => typeof (value as Record<string, unknown>)[key] === 'string',
    );
}

export default function App() {
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    async function load() {
      try {
        const response = await fetch('/api/hello', { signal: controller.signal });
        if (!response.ok) throw new Error('Greeting request failed');
        const data: unknown = await response.json();
        if (!isGreeting(data)) throw new Error('Invalid greeting response');
        if (!controller.signal.aborted) setGreeting(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="page">
      <header className="masthead">
        <a className="brand" href="/" aria-label="project1 home">
          <span className="brand-mark" aria-hidden="true">p<span>1</span></span>
          project1<span className="brand-label"> / playground</span>
        </a>
        <span className="prototype-label">THE FIRST CHAPTER</span>
      </header>

      <main>
        <section className="hello-card" aria-busy={loading} aria-labelledby="greeting-title">
          <div className="card-topline">
            <span className="pill">EXPERIMENT 001</span>
            <span className={`connection ${error ? 'offline' : ''}`} role="status">
              <span className="status-dot" />
              {loading ? 'Connecting' : error ? 'Server unreachable' : 'Connected to server'}
            </span>
          </div>

          <div className="orbit" aria-hidden="true">
            <div className="orbit-ring" />
            <span className="orbit-star">✦</span>
            <span className="planet">✳</span>
            <span className="orbit-dot" />
          </div>

          <div className="greeting" aria-live="polite">
            <p className="eyebrow">{!error && !loading && greeting ? greeting.eyebrow : 'Good things start with a connection.'}</p>
            <h1 id="greeting-title">{loading ? 'A hello is on its way…' : error ? 'A little pause.' : greeting?.title}</h1>
            <p className="message">
              {loading ? 'Reaching out to the server for your first message.' : error
                ? 'We couldn’t reach the server. Make sure it’s running, then let’s try that hello again.'
                : greeting?.message}
            </p>
            <button disabled={loading} onClick={() => setAttempt((value) => value + 1)}>
              {loading ? 'Connecting…' : error ? 'Try again' : 'Say hello again'}
              <span aria-hidden="true">↗</span>
            </button>
            {error && <p className="error-hint" role="alert">Start the Java server on port 8080 to connect.</p>}
          </div>

          <footer className="card-footer">
            <span>CRAFTED ON THE SERVER. BROUGHT TO LIFE HERE.</span>
            <span className="edition">01 / ∞</span>
          </footer>
        </section>

        <div className="journey" aria-label="How this page works">
          <span><span className="step-number">01</span>{!loading && !error && greeting ? greeting.source : 'Java server'}</span>
          <span className="journey-line" aria-hidden="true" />
          <span><span className="step-number">02</span>A tiny JSON hello</span>
          <span className="journey-line" aria-hidden="true" />
          <span><span className="step-number">03</span>React, with a little love</span>
        </div>
      </main>

      <footer className="page-footer"><span>Small beginnings. Open possibilities.</span><span>Built to become something.</span></footer>
    </div>
  );
}
