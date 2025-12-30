import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { type CirclePos, torusPoint } from './parametrics';

type Props = { circlePos: CirclePos };

export default function Torus({ circlePos }: Props) {
	const pointRef = useRef<THREE.Mesh | null>(null);
	const torusRadius = 1;
	const torusTubeRadius = 0.4;

	useFrame(() => {
		if (pointRef.current) {
			const position = torusPoint(torusRadius, torusTubeRadius, circlePos.u, circlePos.v);
			pointRef.current.position.copy(position);
		}
	});

	return (
		<>
			<mesh>
				<torusGeometry args={[torusRadius, torusTubeRadius]} />
				<meshNormalMaterial />
			</mesh>

			<mesh ref={pointRef}>
				<sphereGeometry args={[0.05]} />
				<meshBasicMaterial color={0xff0000} />
			</mesh>

			<OrbitControls target={[0, 0, 0]} enablePan enableZoom enableDamping dampingFactor={0.05} />
		</>
	);
}