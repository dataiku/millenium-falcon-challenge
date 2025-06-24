export type Route = {
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
