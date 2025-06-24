'use client';
import { useActionState } from 'react';
import { handleSubmit } from '@/server/readTheOddsByFormData';
import { INIT_ASYNC_STATE } from '@/lib/AsyncState';
import { UploadIntelUI } from '@/ui/UploadIntelUI';

export const UploadIntel = () => {
  const [state, formAction, isPending] = useActionState(
    handleSubmit,
    INIT_ASYNC_STATE,
  );
  return (
    <UploadIntelUI
      formState={state}
      formAction={formAction}
      isPending={isPending}
    />
  );
};
