import { panic } from '@/lib/panic';
import { readAppConfig } from './readAppConfig';

export type AppConfig = Awaited<ReturnType<typeof readAppConfig>>;
declare global {
  var appConfig: AppConfig | undefined;
}

export const appConfig = () =>
  globalThis.appConfig || panic('Config not initialized');

export const initAppConfig = async (cfgRelPath: string) => {
  const cfg = await readAppConfig(cfgRelPath);
  globalThis.appConfig = cfg;
  return cfg;
};
