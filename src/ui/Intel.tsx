import { EmpireIntel } from '@/lib/EmpireIntel';

export const Intel = ({
  odds,
  intel,
}: {
  odds: number;
  intel: EmpireIntel;
}) => {
  return (
    <ul>
      <li>
        The odds are: <strong>{odds < 0 ? 'Unknown' : `${odds * 100}%`}</strong>
      </li>
      <li>
        Empite strikes in <strong>{intel.countdown}</strong> days
      </li>
      <li>
        <p>Bounty hunters:</p>
        <ol>
          {intel.bounty_hunters.map((bh) => (
            <li key={[bh.planet, bh.day].join()}>
              {bh.planet} on day {bh.day}
            </li>
          ))}
        </ol>
      </li>
    </ul>
  );
};
