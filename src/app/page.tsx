import { PlanetRoutes } from '@/ui/PlanetRoutes';
import { SpaceshipInfo } from '@/ui/SpaceshipInfo';
import { db } from '@/server/global.db';
import { appConfig } from '@/server/global.appConfig';
import { readPlanetRoutes } from '@/server/readPlanetRoutes';
import { UploadIntel } from './UploadIntel';
import styles from './page.module.css';
import { Page } from '@/ui/Page';

export default async function Home() {
  const routes = await readPlanetRoutes(db());

  return (
    <Page title='Millennium Falcon odds calculator'>
      <div className={styles.calculator}>
        <UploadIntel />
      </div>

      <details className={styles.details}>
        <summary>Details</summary>

        <h3>Spaceship</h3>
        <SpaceshipInfo params={appConfig().milleniumFalcon} />

        <h3>Universe map</h3>
        <PlanetRoutes routes={routes} />
      </details>
    </Page>
  );
}
