import { MeshBasicMaterial } from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { mobius3d } from "three/addons/geometries/ParametricFunctions.js";
import { OrbitControls } from "@react-three/drei";

export default function Scene({ circlePos }) {
	const geometry = new ParametricGeometry(mobius3d, 20, 20);
	const material = new MeshBasicMaterial({ color: 0x00ff00 });
	return (
		<>
			<mesh geometry={geometry} material={material} />
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