import { EmpireIntel } from '@/domain/EmpireIntel';
import styles from './DisplayIntel.module.css';

export const DisplayIntel = ({
  odds,
  intel,
}: {
  odds: number;
  intel: EmpireIntel;
}) => {
  const bhGrouped = Object.groupBy(
    intel.bounty_hunters,
    ({ planet }) => planet,
  );
  const bhEntries = Object.entries(bhGrouped).map(
    ([planet, its]) => [planet, (its ?? []).map(({ day }) => day)] as const,
  );
  return (
    <div className={styles.displayIntel}>
      <div className={styles.answer}>
        The chances of success are:{' '}
        <strong>
          {odds < 0 ? 'Unknown' : `${Math.round(odds * 1000) / 10}%`}
        </strong>
        <span className={styles.subtext}>
          {odds <= 0
            ? 'My calculations show a zero probability of survival. Acknowledging that, we cannot proceed.'
            : odds === 1
              ? 'The Force dictates this path. Victory is inevitable.'
              : odds >= 0.5
                ? "A better than even chance? Never tell me the odds! We've got this."
                : 'Our chances are less than half, but a Jedi does not give up. We must rely on the Force, and perhaps a bit of luck.'}
        </span>
      </div>

      <h2>Intel</h2>
      <p>
        Empite strikes in <strong>{intel.countdown}</strong> days
      </p>

      {!bhEntries.length ? (
        <p>No bounty hunters</p>
      ) : (
        <>
          <p>Bounty hunters will be on planet:</p>
          <ol>
            {bhEntries.map(([planet, days]) => (
              <li key={planet}>
                <strong>{planet}</strong> on days:{' '}
                <strong>{days.join(', ')}</strong>
              </li>
            ))}
          </ol>
          <p>
            {intel.bounty_hunters
              .map((it) => [it.planet, it.day].join(''))
              .join(' ')}
          </p>
        </>
      )}
    </div>
  );
};
