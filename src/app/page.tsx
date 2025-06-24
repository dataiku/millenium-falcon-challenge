import { ok } from 'node:assert';
import { readPlanetRoutes } from '@/lib/PlanetRoute';
import { MfConfig, readMfConfig } from '@/lib/MfConfig';
import { PlanetRoutes } from '@/ui/PlanetRoutes';
import { UploadIntel } from '@/ui/UploadIntel';
import styles from './page.module.css';
import { SpaceshipInfo } from '@/ui/SpaceshipInfo';

export default async function Home() {
  const mfRelPath = process.env.APP_MF;
  ok(mfRelPath, 'env APP_MF is required');

  const mfCfg = await readMfConfig(mfRelPath);
  console.log(mfCfg);

  const routes = await readPlanetRoutes(mfCfg.dbAbsPath);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Millennium Falcon odds</h1>

        <h2>Intel</h2>
        <UploadIntel />
        <details>
          <summary>Info</summary>

          <h3>Spaceship</h3>
          <SpaceshipInfo mfConfig={mfCfg.milleniumFalcon} />

          <h3>Universe map</h3>
          <PlanetRoutes routes={routes} />
        </details>
      </main>
    </div>
  );
}
