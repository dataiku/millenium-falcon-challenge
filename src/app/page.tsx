import { ok } from 'node:assert';
import { readDbRoutes } from '@/lib/readDbRoutes';
import { readMfConfig } from '@/lib/readMfConfig';
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
      </main>
    </div>
  );
}

export const Code = ({ children }: { children: unknown }) => (
  <pre>
    <code>{JSON.stringify(children, null, 2)}</code>
  </pre>
);

type Route = {
  origin: string;
  destination: string;
  travel_time: number;
};
export const Routes = ({ routes }: { routes: Route[] }) => (
  <table>
    <thead>
      <tr>
        <th>A</th>
        <th>&nbsp;</th>
        <th>B</th>
        <th>Travel time</th>
      </tr>
    </thead>
    <tbody>
      {routes.map((it) => (
        <tr key={[it.origin, it.destination].join()}>
          <td>{it.origin}</td>
          <td> &larr;&rarr; </td>
          <td>{it.destination}</td>
          <td>{it.travel_time} days</td>
        </tr>
      ))}
    </tbody>
  </table>
);
