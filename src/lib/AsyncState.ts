export type AsyncState<T> =
  | { status: 'ok'; data: T }
  | { status: 'error'; error: unknown }
  | { status: 'noop' };
