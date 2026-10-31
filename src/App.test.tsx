import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';

const greeting = {
  eyebrow: 'A message from the test server',
  title: 'Hello from Java!',
  message: 'This content came from the API, not the client.',
  source: 'Java 25 server',
};

afterEach(() => vi.unstubAllGlobals());

test('loads and displays the content returned by the server', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => greeting });
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);

  expect(screen.getByRole('heading', { name: 'A hello is on its way…' })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: greeting.title })).toBeInTheDocument();
  expect(screen.getByText(greeting.message)).toBeInTheDocument();
  expect(screen.getByText(greeting.eyebrow)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith('/api/hello', expect.objectContaining({ signal: expect.any(AbortSignal) }));
});

test('offers a retry when the server is unavailable', async () => {
  const fetchMock = vi.fn().mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValue({ ok: true, json: async () => greeting });
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Start the Java server');
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('heading', { name: greeting.title })).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test.each([
  { ok: false, json: async () => greeting },
  { ok: true, json: async () => ({ title: 'Incomplete response' }) },
])('shows an error for an unsuccessful or invalid response', async (response) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'A little pause.' })).toBeInTheDocument();
});
