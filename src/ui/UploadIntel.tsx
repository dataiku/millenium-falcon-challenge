'use client';
import { useActionState } from 'react';
import { Intel } from './Intel';
import { handleSubmit } from '../server/analyzeIntel';

export const UploadIntel = () => {
  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: 'noop',
  });
  if (isPending) {
    return <p>Loading...</p>;
  }
  return (
    <form action={formAction}>
      {state.status === 'error' && <div>Error: {String(state.error)}</div>}
      {state.status === 'ok' && (
        <Intel odds={state.data.odds} intel={state.data.intel} />
      )}
      <h3>Upload</h3>
      <input
        type='file'
        name='intel'
        onChange={(evt) => evt.currentTarget.form!.requestSubmit()}
      />
      {/* <button type='submit'>Submit</button> */}
    </form>
  );
};
