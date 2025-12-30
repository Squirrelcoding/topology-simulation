import { MeshBasicMaterial, Vector3 } from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { klein } from "three/addons/geometries/ParametricFunctions.js";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Literally the same as the mobius3d but scaled
function klein3dParameter(v: number, u: number) {
	u *= Math.PI;
	v *= 2 * Math.PI;

	u = u * 2;
	let x, z;
	if (u < Math.PI) {

		x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
		z = - 8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);

	} else {

		x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
		z = - 8 * Math.sin(u);

	}

	const y = - 2 * (1 - Math.cos(u) / 2) * Math.sin(v);

	return new Vector3(x * 0.5, y * 0.5, z * 0.5);
}

export default function Scene({ circlePos }) {
	const geometry = new ParametricGeometry(klein, 32, 32);
	const material = new MeshBasicMaterial({ color: 0x00ff00 });

	const pointRef = useRef();

	useFrame(() => {
		if (pointRef.current) {
			const position = klein3dParameter(circlePos.u, circlePos.v);
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