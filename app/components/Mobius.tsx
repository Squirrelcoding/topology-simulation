import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export default function Scene({ circlePos }) {
	const materials = useLoader(MTLLoader, "./mobius.mtl");
	const obj = useLoader(OBJLoader, "./mobius.obj", (loader) => {
		materials.preload();
		loader.setMaterials(materials);
	});
	console.log(obj);
	return (
		<>
			<primitive object={obj} scale={0.4} />
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