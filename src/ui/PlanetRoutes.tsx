import { PlanetRoute } from '@/domain/PlanetRoute';
import Script from 'next/script';

export const PlanetRoutes = ({ routes }: { routes: PlanetRoute[] }) => (
  <div>
    <Script src='https://d3js.org/d3.v7.min.js' />
    <table>
      <thead>
        <tr>
          <th>#1</th>
          <th>Days</th>
          <th>#2</th>
        </tr>
      </thead>
      <tbody>
        {routes.map((it) => (
          <tr key={[it.origin, it.destination].join()}>
            <td>{it.origin}</td>
            <td style={{ textAlign: 'center' }}>
              &larr; {it.travel_time} &rarr;
            </td>
            <td>{it.destination}</td>
            <th>&nbsp;</th>
          </tr>
        ))}
      </tbody>
    </table>
    <p>
      {routes
        .map((it) => [it.origin, it.destination, it.travel_time].join(''))
        .join(' ')}
    </p>
  </div>
);
