import { EmpireIntel } from '@/domain/EmpireIntel';
import styles from './DisplayIntel.module.css';

export const DisplayIntel = ({
  odds,
  intel,
}: {
  odds: number;
  intel: EmpireIntel;
}) => {
  return (
    <>
      <p className={styles.answer}>
        The chances of success are:{' '}
        <strong>{odds < 0 ? 'Unknown' : `${odds * 100}%`}</strong>
      </p>

      <h2>Intel</h2>
      <p>
        Empite strikes in <strong>{intel.countdown}</strong> days
      </p>
      <p>Bounty hunters:</p>
      <ol>
        {intel.bounty_hunters.map((bh) => (
          <li key={[bh.planet, bh.day].join()}>
            {bh.planet} on day {bh.day}
          </li>
        ))}
      </ol>
    </>
  );
};
