import { MeshBasicMaterial, Vector3 } from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { mobius3d } from "three/addons/geometries/ParametricFunctions.js";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Literally the same as the mobius3d but scaled
function mobius3dParameter(u: number, t: number) {
	u *= Math.PI;
	t *= 2 * Math.PI;

	u = u * 2;
	const phi = u / 2;
	const major = 2.25, a = 0.125, b = 0.65;

	let x = a * Math.cos( t ) * Math.cos( phi ) - b * Math.sin( t ) * Math.sin( phi );
	const z = a * Math.cos( t ) * Math.sin( phi ) + b * Math.sin( t ) * Math.cos( phi );
	const y = ( major + x ) * Math.sin( u );
	x = ( major + x ) * Math.cos( u );

	return new Vector3(x * 0.5, y * 0.5, z * 0.5);
}

export default function Scene({ circlePos }) {
	const geometry = new ParametricGeometry(mobius3d, 32, 32);
	const material = new MeshBasicMaterial({ color: 0x00ff00 });

	const pointRef = useRef();

	useFrame(() => {
		if (pointRef.current) {
			const position = mobius3dParameter(circlePos.u, circlePos.v);
			pointRef.current.position.copy(position);
		}
	});


	return (
		<>
			<mesh geometry={geometry} material={material} scale={0.5} />
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