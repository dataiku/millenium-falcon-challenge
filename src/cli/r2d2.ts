import { calculateOddsByFilePaths } from './calculateOddsByFilePaths';

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

const data = await calculateOddsByFilePaths({
  mfCfgRelativePath,
  empireCfgRelativePath,
});

const logTable = (tblName: string, rows: unknown) => {
  console.log('[R2D2]', tblName);
  console.table(rows);
};

logTable('Config paths', data.paths);
logTable('Routes', data.routes);
logTable('Bounty hunters', data.empireIntel.bounty_hunters);
logTable('Millennium Falcon info', data.mfConfig);
logTable('Travel path', data.travelPath.map(({ item }) => item).reverse());

console.log('[R2D2] Countdown days:', data.empireIntel.countdown);
console.log('[R2D2] The odds of success are: %o%', 100 * data.odds);
