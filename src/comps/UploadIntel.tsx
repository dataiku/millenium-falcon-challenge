'use client';
import { EmpireIntel } from '@/lib/EmpireIntel';
import { handleSubmit, State } from './analyzeIntel';
import { useActionState } from 'react';

export const UploadIntel = () => {
  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: 'noop' as const,
  } as State);
  if (isPending) {
    return <p>Loading...</p>;
  }
  return (
    <form action={formAction}>
      {state.status === 'error' && <div>Error: {String(state.error)}</div>}
      {state.status === 'ok' && <Intel intel={state.intel} />}
      <h3>Upload</h3>
      <input type='file' name='intel' />
      <button type='submit'>Submit</button>
    </form>
  );
};

const Intel = ({ intel }: { intel: EmpireIntel }) => {
  return (
    <div>
      <p>
        Empite strikes in <strong>{intel.countdown}</strong> days
      </p>
      <p>
        <strong>Bounty hunters:</strong>
      </p>
      <ol>
        {intel.bounty_hunters.map((bh) => (
          <li key={[bh.planet, bh.day].join()}>
            {bh.planet} on day {bh.day}
          </li>
        ))}
      </ol>
    </div>
  );
};
