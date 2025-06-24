import { PlanetRoutes } from '@/ui/PlanetRoutes';
import { SpaceshipInfo } from '@/ui/SpaceshipInfo';
import { db } from '@/server/global.db';
import { appConfig } from '@/server/global.appConfig';
import { readPlanetRoutes } from '@/server/readPlanetRoutes';
import { UploadIntel } from './UploadIntel';
import styles from './page.module.css';

export default async function Home() {
  const routes = await readPlanetRoutes(db());

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Millennium Falcon odds calculator</h1>

        <UploadIntel />

        <details>
          <summary>Info</summary>

          <h3>Spaceship</h3>
          <SpaceshipInfo params={appConfig().milleniumFalcon} />

          <h3>Universe map</h3>
          <PlanetRoutes routes={routes} />
        </details>
      </main>
    </div>
  );
}
