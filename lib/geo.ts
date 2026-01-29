export function clampLatLng(lat: number, lng: number) {
  if (lat < -90 || lat > 90) throw new Error("Latitude inválida");
  if (lng < -180 || lng > 180) throw new Error("Longitude inválida");
}
