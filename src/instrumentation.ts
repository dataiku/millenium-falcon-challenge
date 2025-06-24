export const runtime = 'nodejs';
export const register = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const cfgRelPath = process.env.APP_MF_CFG;
  if (!cfgRelPath) {
    throw new Error('env.APP_MF_CFG is required');
  }

  const { initAppConfig } = await import('./server/global.appConfig');
  const { paths } = await initAppConfig(cfgRelPath);

  const { initDB } = await import('./server/global.db');
  await initDB(paths.db);

  console.log(`Init done. Used ${cfgRelPath}`);
};
