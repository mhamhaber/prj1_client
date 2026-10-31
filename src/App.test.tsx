import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

test('sends entered text and displays the server response, not the local input', async () => {
  let resolveResponse!: (value: unknown) => void;
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => greeting })
    .mockImplementationOnce(() => new Promise((resolve) => { resolveResponse = resolve; }));
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);
  await screen.findByRole('heading', { name: greeting.title });

  expect(screen.getByRole('button', { name: 'Send text' })).toBeDisabled();
  fireEvent.change(screen.getByRole('textbox', { name: 'Your text' }), { target: { value: 'Hello & café + 世界' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send text' }));
  expect(fetchMock).toHaveBeenLastCalledWith(`/api/hello?${new URLSearchParams({ text: 'Hello & café + 世界' })}`,
    expect.objectContaining({ signal: expect.any(AbortSignal) }));
  expect(screen.getByRole('button', { name: 'Connecting…' })).toBeDisabled();
  expect(screen.queryByText('Server echoed my text')).not.toBeInTheDocument();

  resolveResponse({ ok: true, json: async () => ({ ...greeting, message: 'Server echoed my text' }) });
  expect(await screen.findByText('Server echoed my text')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Send text' })).toBeEnabled();
});

test('retries the submitted text even if the input has since changed', async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => greeting })
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValue({ ok: true, json: async () => ({ ...greeting, message: 'Original text' }) });
  vi.stubGlobal('fetch', fetchMock);
  render(<App />);
  await screen.findByRole('heading', { name: greeting.title });
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Original text' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send text' }));
  await screen.findByRole('alert');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Edited draft' } });
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByText('Original text')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenLastCalledWith('/api/hello?text=Original+text', expect.anything());

  fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Send text' })).toBeDisabled());
});
