import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const ParticleDNA = (props) => {
    const points = useRef();

    // Generate particles for the double helix
    const particles = useMemo(() => {
        const temp = [];
        const count = 2000; // Number of particles
        const radius = 3;
        const height = 18;
        const turns = 5;

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = t * Math.PI * 2 * turns;
            const y = t * height - height / 2;

            // Strand 1
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;

            // Strand 2 (offset by PI)
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            // Add some randomness/spread to make it look like a cloud of data
            const spread = 0.2;

            temp.push(
                x1 + (Math.random() - 0.5) * spread,
                y + (Math.random() - 0.5) * spread,
                z1 + (Math.random() - 0.5) * spread
            );

            temp.push(
                x2 + (Math.random() - 0.5) * spread,
                y + (Math.random() - 0.5) * spread,
                z2 + (Math.random() - 0.5) * spread
            );

            // Random connections (base pairs) - fewer of them
            if (Math.random() > 0.95) {
                for (let j = 0; j < 20; j++) {
                    const lerpT = j / 20;
                    temp.push(
                        x1 * (1 - lerpT) + x2 * lerpT,
                        y,
                        z1 * (1 - lerpT) + z2 * lerpT
                    );
                }
            }
        }
        return new Float32Array(temp);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        points.current.rotation.y = -t * 0.2;
        points.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    });

    return (
        <points ref={points} {...props}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                color="#06b6d4"
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const DNAHelix = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <React.Suspense fallback={null}>
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                        <ParticleDNA />
                    </Float>

                    {/* Background ambience */}
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                    {/* Lighting to enhance the particles if we used standard material, 
                        but pointsMaterial is unlit. Adding lights for any other potential objects */}
                    <ambientLight intensity={0.5} />

                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </React.Suspense>
            </Canvas>
        </div>
    );
};

export default DNAHelix;
