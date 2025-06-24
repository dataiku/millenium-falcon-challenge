export type AsyncStateNoop = { status: 'noop' };
export const INIT_ASYNC_STATE: AsyncStateNoop = { status: 'noop' };

export type AsyncState<T> =
  | { status: 'ok'; data: T }
  | { status: 'error'; error: unknown }
  | AsyncStateNoop;
