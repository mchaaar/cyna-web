'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function ThreeScene() {
    return (
        <Canvas className="h-96 w-full">
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
            <OrbitControls />
            <Stars radius={100} depth={50} count={5000} factor={4} />
        </Canvas>
    );
}
