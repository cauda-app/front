import { IssuedNumberStatus } from '../../graphql';

export default function getTurnColor(status: IssuedNumberStatus) {
  if (status === 'ATTENDED') {
    return 'success';
  }

  if (status === 'SKIPPED') {
    return 'danger';
  }

  if (status === 'CANCELLED') {
    return 'warning';
  }
}
