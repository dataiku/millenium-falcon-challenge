import { ok } from 'node:assert';
import { isEmpireIntel } from '@/domain/EmpireIntel';

export const parseIntel = async (intel: FormDataEntryValue | null) => {
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
};
