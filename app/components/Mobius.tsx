import { MeshNormalMaterial, Vector3 } from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { mobius3d } from 'three/addons/geometries/ParametricFunctions.js';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { CirclePos } from './parametrics';

// Scaled mobius parametric helper (keeps original math, returns Vector3)
function mobius3dParameter(u: number, t: number) {
	u *= Math.PI;
	t *= 2 * Math.PI;

	u = u * 2;
	const phi = u / 2;
	const major = 2.25,
		a = 0.125,
		b = 0.65;

	let x = a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi);
	const z = a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi);
	const y = (major + x) * Math.sin(u);
	x = (major + x) * Math.cos(u);

	return new Vector3(x * 0.5, y * 0.5, z * 0.5);
}

type Props = { circlePos: CirclePos };

export default function Mobius({ circlePos }: Props) {
	const geometry = new ParametricGeometry(mobius3d, 32, 32);
	const material = new MeshNormalMaterial();

	const pointRef = useRef<THREE.Mesh | null>(null);

	useFrame(() => {
		if (pointRef.current) {
			const position = mobius3dParameter(circlePos.u, circlePos.v);
			pointRef.current.position.copy(position);
		}
	});

	return (
		<>
			<mesh geometry={geometry} material={material} scale={0.5} />
			<OrbitControls target={[0, 0, 0]} enablePan enableZoom enableDamping dampingFactor={0.05} />

			<mesh ref={pointRef}>
				<sphereGeometry args={[0.05]} />
				<meshBasicMaterial color={0xff0000} />
			</mesh>
		</>
	);
}