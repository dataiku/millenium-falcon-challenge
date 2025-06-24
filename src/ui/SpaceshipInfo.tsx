import { MfConfig } from '../lib/MfConfig';

export const SpaceshipInfo = ({ mfConfig }: { mfConfig: MfConfig }) => (
  <ul>
    <li>
      Can fly autonomously for <strong>{mfConfig.autonomy}</strong> days
    </li>
    <li>
      From <strong>{mfConfig.departure}</strong> to{' '}
      <strong>{mfConfig.arrival}</strong>.
    </li>
  </ul>
);
