export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // 1. Validação de segurança: Garante que tudo é número finito
  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon2)
  ) {
    console.warn("haversineMeters: Coordenadas inválidas recebidas.");
    return 0;
  }

  // 2. Otimização: Se for o mesmo lugar, distância é zero
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371000; // Raio da terra em metros
  const toRad = (v: number) => (v * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  // Math.atan2 é mais estável computacionalmente que Math.asin para distâncias curtas/longas
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  // Garante que não retornaremos NaN em casos matemáticos extremos
  return Number.isNaN(distance) ? 0 : distance;
}