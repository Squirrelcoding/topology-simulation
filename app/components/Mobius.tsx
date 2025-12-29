import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Scene({ circlePos }) {
	const obj = useLoader(OBJLoader, './mobius_2.obj');

	return (
		<>
			<primitive object={obj} />

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