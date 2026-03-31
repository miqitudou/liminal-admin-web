export function centsToYuan(cents: number): string {
  return (Number(cents || 0) / 100).toFixed(2);
}

export function yuanToCents(value: string | number): number {
  return Math.round(Number(value || 0) * 100);
}
