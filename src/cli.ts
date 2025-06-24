import { getBaseURL } from './lib/getBaseURL';
import { loadJSON } from './lib/loadJSON';
import { readPlanetRoutes } from './lib/PlanetRoute';
import { readMfConfig } from './lib/MfConfig';

const argv = process.argv.slice(2);
const [mfCfgRelativePath, empireCfgRelativePath] = argv;

if (!mfCfgRelativePath || !empireCfgRelativePath) {
  console.log('\n');
  console.error('\tMissing arguments. Usage:');
  console.error(
    '\tnpm run give-me-the-odds <millennium-falcon.json> <empire.json>',
  );
  console.log('\n');
  process.exit(1);
}

const main = async () => {
  const cfg = await readMfConfig(mfCfgRelativePath);
  console.log(cfg.dbAbsPath);
  console.log(await readPlanetRoutes(cfg.dbAbsPath));

  const empirePath = getBaseURL(empireCfgRelativePath);
  console.log(empirePath);
  console.log(await loadJSON(empirePath));

  console.log(mfCfgRelativePath);
  console.log(cfg.milleniumFalcon);
};

main();
