import { AsyncState } from '@/lib/AsyncState';

export const createSubmitHandler =
  <T>(readData: (formData: FormData) => Promise<T>) =>
  async (
    _prevState: AsyncState<T>,
    formData: FormData,
  ): Promise<AsyncState<T>> =>
    await Promise.resolve()
      .then(() => readData(formData))
      .then((data) => ({
        status: 'ok' as const,
        data,
      }))
      .catch((err: unknown) => ({
        status: 'error' as const,
        error: err,
      }));
