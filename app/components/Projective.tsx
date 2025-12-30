import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { MeshNormalMaterial, Vector3 } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/Addons.js';
import type { CirclePos } from './parametrics';

// Core Boy's surface computation returns a scaled Vector3 for (u,v) in [0,1]^2
function computeBoysVector(u: number, v: number) {
	// map inputs to conventional ranges
	const uu = Math.PI * u - Math.PI / 2; // in [-π/2, π/2]
	const vv = Math.PI * v; // in [0, π]

	const sqrt2 = Math.sqrt(2);

	const cosu = Math.cos(uu);
	const sinu = Math.sin(uu);
	const cosv = Math.cos(vv);

	const cos2u = Math.cos(2 * uu);
	const sin2u = Math.sin(2 * uu);
	const sin2v = Math.sin(2 * vv);
	const sin3u = Math.sin(3 * uu);

	const cosv2 = cosv * cosv;

	const denom = 2 - sqrt2 * sin3u * sin2v;

	const x = (sqrt2 * cosv2 * cos2u + cosu * sin2v) / denom;
	const y = (sqrt2 * cosv2 * sin2u - sinu * sin2v) / denom;
	const z = (3 * cosv2) / denom;

	return new Vector3(x * 0.5, y * 0.5, z * 0.5);
}

// ParametricGeometry expects (u,v,target) where u,v ∈ [0,1]
function boysSurface(u: number, v: number, target: Vector3) {
	target.copy(computeBoysVector(u, v));
}

function boysSurfaceParameter(u: number, v: number) {
	return computeBoysVector(u, v);
}

type Props = { circlePos: CirclePos };

export default function Projective({ circlePos }: Props) {
	const geometry = new ParametricGeometry(boysSurface, 64, 64);
	const material = new MeshNormalMaterial();

	const pointRef = useRef<THREE.Mesh | null>(null);

	useFrame(() => {
		if (pointRef.current) {
			const position = boysSurfaceParameter(circlePos.u, circlePos.v);
			pointRef.current.position.copy(position);
		}
	});

	return (
		<>
			<mesh geometry={geometry} material={material}  />
			<OrbitControls target={[0, 0, 0]} enablePan enableZoom enableDamping dampingFactor={0.05} />

			<mesh ref={pointRef}>
				<sphereGeometry args={[0.05]} />
				<meshBasicMaterial color={0xff0000} />
			</mesh>
		</>
	);
}