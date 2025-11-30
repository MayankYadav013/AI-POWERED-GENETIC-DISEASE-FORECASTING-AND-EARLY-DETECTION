import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DNAStrand = (props) => {
    const group = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = -t * 0.5;
    });

    const count = 20;
    const radius = 2;
    const height = 8;

    return (
        <group ref={group} {...props}>
            {Array.from({ length: count }).map((_, i) => {
                const y = (i / count) * height - height / 2;
                const angle = (i / count) * Math.PI * 4;

                const x1 = Math.cos(angle) * radius;
                const z1 = Math.sin(angle) * radius;

                const x2 = Math.cos(angle + Math.PI) * radius;
                const z2 = Math.sin(angle + Math.PI) * radius;

                return (
                    <group key={i} position={[0, y, 0]}>
                        {/* Base pairs connection */}
                        <mesh rotation={[0, -angle, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, radius * 2, 8]} />
                            <meshStandardMaterial color="#4f46e5" transparent opacity={0.5} />
                        </mesh>

                        {/* Strand 1 */}
                        <mesh position={[x1, 0, z1]}>
                            <sphereGeometry args={[0.3, 16, 16]} />
                            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
                        </mesh>

                        {/* Strand 2 */}
                        <mesh position={[x2, 0, z2]}>
                            <sphereGeometry args={[0.3, 16, 16]} />
                            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

const DNAHelix = () => {
    return (
        <div style={{ height: '100%', width: '100%', minHeight: '400px' }}>
            <Canvas camera={{ position: [0, 0, 12], fov: 40 }}>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <DNAStrand />
                </Float>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={1} color="#4f46e5" />
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
};

export default DNAHelix;
