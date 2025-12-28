import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function torusPoint(R: number, r: number, u: number, v: number) {
	const uRad = u * 2 * Math.PI;
	const vRad = v * 2 * Math.PI;
	return new THREE.Vector3(
		(R + r * Math.cos(vRad)) * Math.cos(uRad),
		(R + r * Math.cos(vRad)) * Math.sin(uRad),
		r * Math.sin(vRad)
	);
}

export default function Scene({ circlePos }) {
	const pointRef = useRef();
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

			<OrbitControls
				target={[0, 0, 0]}
				enablePan={true}
				enableZoom={true}
				enableDamping={true}
				dampingFactor={0.05}
			/>
		</>
	);
}