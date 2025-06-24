import { ok } from 'node:assert';
import { readDbRoutes } from '@/lib/readDbRoutes';
import { readMfConfig } from '@/lib/readMfConfig';
import { Route, Routes } from '@/comps/Routes';
import { UploadIntel } from '@/comps/UploadIntel';
import styles from './page.module.css';

export default async function Home() {
  const mfRelPath = process.env.APP_MF;
  ok(mfRelPath, 'env APP_MF is required');

  const mfCfg = await readMfConfig(mfRelPath);
  console.log(mfCfg);

  const routes = await readDbRoutes(mfCfg.dbAbsPath);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Millennium Falcon odds</h1>

        <h2>Intel</h2>
        <UploadIntel />
        <details>
          <summary>Info</summary>
          <h2>Fleet</h2>
          <ul>
            <li>
              Can fly autonomously for{' '}
              <strong>{mfCfg.milleniumFalcon.autonomy}</strong> days
            </li>
            <li>
              From <strong>{mfCfg.milleniumFalcon.departure}</strong> to{' '}
              <strong>{mfCfg.milleniumFalcon.arrival}</strong>.
            </li>
          </ul>

          <h2>Universe</h2>
          <Routes routes={routes as Route[]} />
        </details>
      </main>
    </div>
  );
}
