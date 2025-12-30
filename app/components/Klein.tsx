import { MeshNormalMaterial, Vector3 } from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { klein } from 'three/addons/geometries/ParametricFunctions.js';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { CirclePos } from './parametrics';

const SCALE = 0.25;

function klein3dParameter(v: number, u: number) {
	u *= Math.PI;
	v *= 2 * Math.PI;

	u = u * 2;
	let x, z;
	if (u < Math.PI) {
		x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
		z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
	} else {
		x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
		z = -8 * Math.sin(u);
	}

	const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

	return new Vector3(x * SCALE, y * SCALE, z * SCALE);
}

type Props = { circlePos: CirclePos };

export default function Klein({ circlePos }: Props) {
	const geometry = new ParametricGeometry(klein, 32, 32);
	const material = new MeshNormalMaterial();

	const pointRef = useRef<THREE.Mesh | null>(null);

	useFrame(() => {
		if (pointRef.current) {
			const position = klein3dParameter(circlePos.u, circlePos.v);
			pointRef.current.position.copy(position);
		}
	});

	return (
		<>
			<mesh geometry={geometry} material={material} scale={SCALE} />
			<OrbitControls target={[0, 0, 0]} enablePan enableZoom enableDamping dampingFactor={0.05} />

			<mesh ref={pointRef}>
				<sphereGeometry args={[0.05]} />
				<meshBasicMaterial color={0xff0000} />
			</mesh>
		</>
	);
}