import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/Addons.js';


function boysSurface(u: number, v: number, target: Vector3) {
	// u ∈ [-π/2, π/2]
	// v ∈ [0, π]
	u = Math.PI * u - Math.PI / 2;
	v = Math.PI * v;

	const sqrt2 = Math.sqrt(2);

	const cosu = Math.cos(u);
	const sinu = Math.sin(u);
	const cosv = Math.cos(v);

	const cos2u = Math.cos(2 * u);
	const sin2u = Math.sin(2 * u);
	const sin2v = Math.sin(2 * v);
	const sin3u = Math.sin(3 * u);

	const cosv2 = cosv * cosv;

	const denom = 2 - sqrt2 * sin3u * sin2v;

	const x =
		(sqrt2 * cosv2 * cos2u + cosu * sin2v) / denom;

	const y =
		(sqrt2 * cosv2 * sin2u - sinu * sin2v) / denom;

	const z =
		(3 * cosv2) / denom;

	target.set(x, y, z);

}

function boysSurfaceParameter(u: number, v: number) {
	// Assuming that u is in [-pi/2, pi/2] and v in [0, pi].
	// https://mathworld.wolfram.com/BoySurface.html
	u = Math.PI * u - Math.PI / 2;
	v = Math.PI * v;
	const sqrt2 = Math.sqrt(2);

	const cosu = Math.cos(u);
	const sinu = Math.sin(u);
	const cosv = Math.cos(v);

	const cos2u = Math.cos(2 * u);
	const sin2u = Math.sin(2 * u);
	const sin2v = Math.sin(2 * v);
	const sin3u = Math.sin(3 * u);

	const cosv2 = cosv * cosv;

	const denom = 2 - sqrt2 * sin3u * sin2v;

	const x =
		(sqrt2 * cosv2 * cos2u + cosu * sin2v) / denom;

	const y =
		(sqrt2 * cosv2 * sin2u - sinu * sin2v) / denom;

	const z =
		(3 * cosv2) / denom;

	return new Vector3(x * 0.5, y * 0.5, z * 0.5);
}

export default function Scene({ circlePos }) {
	const geometry = new ParametricGeometry(boysSurface, 64, 64);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

	const pointRef = useRef();

	useFrame(() => {
		if (pointRef.current) {
			const position = boysSurfaceParameter(circlePos.u, circlePos.v);
			pointRef.current.position.copy(position);
		}
	});


	return (
		<>
			<mesh geometry={geometry} material={material} scale={0.5}>
				<meshNormalMaterial />
			</mesh>
			<OrbitControls
				target={[0, 0, 0]}
				enablePan={true}
				enableZoom={true}
				enableDamping={true}
				dampingFactor={0.05}
			/>

			<mesh ref={pointRef}>
				<sphereGeometry args={[0.05]} />
				<meshBasicMaterial color={0xff0000} />
			</mesh>
		</>
	);
}