'use server';
import { EmpireIntel, isEmpireIntel } from '@/lib/EmpireIntel';
import { ok } from 'assert';

export async function analyzeIntel(formData: FormData) {
  const intel = formData.get('intel');
  if (!intel) {
    ok(false, 'Missing intel');
  }
  if (typeof intel === 'string') {
    ok(false, 'Invalid intel: expected file');
  }

  const text = await intel.text();
  const json = JSON.parse(text);
  if (!isEmpireIntel(json)) {
    ok(false, 'Invalid intel: invalid JSON');
  }

  return json;
}

export type State =
  | { status: 'ok'; intel: EmpireIntel; odds: number }
  | { status: 'error'; error: unknown }
  | { status: 'noop' };

export const handleSubmit = async (
  _prevState: State,
  formData: FormData,
): Promise<State> =>
  await Promise.resolve()
    .then(() => analyzeIntel(formData))
    .then((intel) => ({
      status: 'ok' as const,
      intel,
      odds: -1,
    }))
    .catch((err: unknown) => ({
      status: 'error' as const,
      error: err,
    }));
