export const panic = (msg: string): never => {
  throw new Error(msg);
};
