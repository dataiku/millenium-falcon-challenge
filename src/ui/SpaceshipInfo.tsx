import { SpaceshipParams } from '@/domain/MfConfig';

export const SpaceshipInfo = ({ params }: { params: SpaceshipParams }) => (
  <ul>
    <li>
      Can fly autonomously for <strong>{params.autonomy}</strong> days
    </li>
    <li>
      <strong>{params.departure}</strong> &rarr;{' '}
      <strong>{params.arrival}</strong>.
    </li>
  </ul>
);
