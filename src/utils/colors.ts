export type Colors = 'ATTENDED' | 'SKIPPED' | 'CANCELLED';

export default function getTurnColor(status: Colors) {
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
