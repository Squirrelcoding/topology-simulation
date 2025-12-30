import * as THREE from 'three';

export interface CirclePos { u: number; v: number }

export function torusPoint(R: number, r: number, u: number, v: number) {
  const uRad = u * 2 * Math.PI;
  const vRad = v * 2 * Math.PI;
  return new THREE.Vector3(
    (R + r * Math.cos(vRad)) * Math.cos(uRad),
    (R + r * Math.cos(vRad)) * Math.sin(uRad),
    r * Math.sin(vRad)
  );
}
