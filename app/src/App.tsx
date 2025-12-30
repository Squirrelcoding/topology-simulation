import React, { useRef, useState, useEffect, act } from 'react';
import { Canvas } from '@react-three/fiber';
import Torus from "../components/Torus";
import Mobius from "../components/Mobius";
import Klein from "../components/Klein";
import Projective from "../components/Projective";


function FundamentalSquare({ onPositionChange }) {
	const canvasRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [circlePos, setCirclePos] = useState({ x: 75, y: 75 });
	const squareSize = 150;
	const circleRadius = 10;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');

		// Clear canvas
		ctx.clearRect(0, 0, squareSize, squareSize);

		// Draw border
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, squareSize, squareSize);

		// Draw circle
		ctx.fillStyle = 'red';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(circlePos.x, circlePos.y, circleRadius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();

		// Update parent component
		onPositionChange({
			u: circlePos.x / squareSize,
			v: circlePos.y / squareSize
		});
	}, [circlePos, squareSize, onPositionChange]);

	const handleMouseDown = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const dist = Math.sqrt((x - circlePos.x) ** 2 + (y - circlePos.y) ** 2);
		if (dist <= circleRadius) {
			setIsDragging(true);
		}
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;

		const rect = canvasRef.current.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		console.log(x, y)

		// Wrap horizontally
		if (x < 0) {
			x = (squareSize + x) % squareSize;
		} else if (x > squareSize) {
			x %= squareSize;
		}

		// Wrap vertically
		if (y < 0) {

			// for some reason 20 works but not 1 or 2...
			y = (20 * squareSize + y) % squareSize;
		} else if (y > squareSize) {
			y = y % squareSize;
		}

		setCirclePos({ x, y });
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isDragging, circlePos]);

	return (
		<div style={{
			position: 'fixed',
			bottom: '20px',
			left: '20px',
			zIndex: 10,
			background: 'white',
			padding: '16px',
			borderRadius: '12px',
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
		}}>
			<p style={{
				margin: '0 0 12px 0',
				fontWeight: 600,
				fontSize: '14px',
				fontFamily: 'sans-serif'
			}}>
				Fundamental square
			</p>
			<canvas
				ref={canvasRef}
				width={squareSize}
				height={squareSize}
				onMouseDown={handleMouseDown}
				style={{
					border: '2px solid black',
					borderRadius: '4px',
					cursor: isDragging ? 'grabbing' : 'grab',
					display: 'block'
				}}
			/>
		</div>
	);
}

export default function App() {
	const [circlePos, setCirclePos] = useState({ u: 0.5, v: 0.5 });
	const [activeSurface, setActiveSurface] = useState('torus');
	const [highlighterStyle, setHighlighterStyle] = useState({});
	const menuRef = useRef(null);
	const buttonRefs = useRef({});

	const surfaces = [
		{ id: 'torus', label: 'Torus' },
		{ id: 'mobius', label: 'Möbius Strip' },
		{ id: 'klein', label: 'Klein Bottle' },
		{ id: 'projective', label: 'Projective Plane' }
	];

	useEffect(() => {
		console.log(activeSurface);
		if (buttonRefs.current[activeSurface] && menuRef.current) {
			const btn = buttonRefs.current[activeSurface];
			const btnRect = btn.getBoundingClientRect();
			const containerRect = menuRef.current.getBoundingClientRect();

			setHighlighterStyle({
				width: `${btnRect.width}px`,
				left: `${btnRect.left - containerRect.left}px`
			});
		}
	}, [activeSurface]);
	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			margin: 0,
			padding: 0,
			overflow: 'hidden',
			background: 'white'
		}}>
			<div style={{
				position: 'fixed',
				top: '20px',
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 100,
				background: 'rgba(255, 255, 255, 0.16)',
				padding: '8px 12px',
				borderRadius: '16px',
				border: '1px solid rgba(255, 255, 255, 0.3)',
				backdropFilter: 'blur(5px)',
				boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
			}}>
				<div ref={menuRef} style={{
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
					position: 'relative'
				}}>
					<div style={{
						position: 'absolute',
						background: 'white',
						borderRadius: '50px',
						transition: 'all 0.3s ease',
						zIndex: 1,
						height: 'calc(100% - 8px)',
						top: '4px',
						...highlighterStyle
					}} />
					{surfaces.map(surface => (
						<button
							key={surface.id}
							ref={el => buttonRefs.current[surface.id] = el}
							onClick={() => setActiveSurface(surface.id)}
							style={{
								background: 'transparent',
								border: 'none',
								color: activeSurface === surface.id ? 'black' : 'rgba(255, 255, 255, 0.6)',
								padding: '8px 20px',
								borderRadius: '50px',
								fontSize: '14px',
								fontWeight: 500,
								cursor: 'pointer',
								transition: 'color 0.3s ease',
								position: 'relative',
								zIndex: 2
							}}
							onMouseEnter={(e) => {
								if (activeSurface !== surface.id) {
									e.target.style.color = 'rgba(255, 255, 255, 0.9)';
								}
							}}
							onMouseLeave={(e) => {
								if (activeSurface !== surface.id) {
									e.target.style.color = 'rgba(255, 255, 255, 0.6)';
								}
							}}
						>
							{surface.label}
						</button>
					))}
				</div>
			</div>
			<FundamentalSquare onPositionChange={setCirclePos} />
			<Canvas
				camera={{ position: [5, 5, 5], fov: 75 }}
				gl={{ antialias: true }}
			>
				{activeSurface == "torus" && <Torus circlePos={circlePos} />}
				{activeSurface == "mobius" && <Mobius circlePos={circlePos} />}
				{activeSurface == "klein" && <Klein circlePos={circlePos} />}
				{activeSurface == "projective" && <Projective circlePos={circlePos} />}
			</Canvas>
		</div>
	);
}