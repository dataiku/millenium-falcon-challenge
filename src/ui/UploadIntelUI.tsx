import { AsyncState } from '@/lib/AsyncState';
import { EmpireIntel } from '@/domain/EmpireIntel';
import { DisplayIntel } from './DisplayIntel';

export const UploadIntelUI = ({
  formState,
  isPending,
  formAction,
}: {
  formState: AsyncState<{
    intel: EmpireIntel;
    odds: number;
  }>;
  isPending: boolean;
  formAction: (fd: FormData) => void;
}) => {
  if (isPending) {
    return <p>Loading...</p>;
  }
  return (
    <form action={formAction}>
      {formState.status === 'error' && (
        <div>Error: {String(formState.error)}</div>
      )}
      {formState.status === 'ok' && (
        <DisplayIntel odds={formState.data.odds} intel={formState.data.intel} />
      )}
      <p>
        <strong>Upload new intel</strong>{' '}
      </p>
      <input
        type='file'
        name='intel'
        onChange={(evt) => evt.currentTarget.form!.requestSubmit()}
      />
      {/* <button type='submit'>Submit</button> */}
    </form>
  );
};
