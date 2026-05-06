import React, { useRef, useState } from 'react';
// Fix: Import `MeshProps` from `@react-three/fiber` to resolve the JSX namespace error.
import { Canvas, useFrame, MeshProps } from '@react-three/fiber';
import { ARButton, VRButton, XR, Controllers, Hands } from '@react-three/xr';
import * as THREE from 'three';

// A placeholder 3D model component that rotates.
// Fix: Use the imported `MeshProps` type for the component's props.
function ProductModel(props: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Rotate mesh every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
        meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[0.2, 0.3, 0.15]} />
      <meshStandardMaterial color={'#0ea5e9'} roughness={0.3} metalness={0.8} />
    </mesh>
  );
}

interface XRViewerProps {
    mode: 'AR' | 'VR';
    projectName: string;
}

const XRViewer: React.FC<XRViewerProps> = ({ mode, projectName }) => {
    const [isSupported, setIsSupported] = useState(true);

    // Check for WebXR support on component mount
    React.useEffect(() => {
        if ('xr' in navigator) {
            (navigator as any).xr.isSessionSupported(mode === 'AR' ? 'immersive-ar' : 'immersive-vr')
                .then((supported: boolean) => {
                    setIsSupported(supported);
                });
        } else {
            setIsSupported(false);
        }
    }, [mode]);

    return (
        <div className="border border-slate-200 dark:border-slate-700/80 hc:border-yellow-300/50 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 hc:bg-black border-b border-slate-200 dark:border-slate-700/80 hc:border-yellow-300/50">
                <h4 className="font-bold text-slate-800 dark:text-white hc:text-yellow-300">Interactive {mode} Preview</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mt-1">
                    {mode === 'AR' ? 'Use your phone to place the product in your room.' : 'Use a VR headset to view the product in an immersive space.'}
                </p>
                 <p className="text-xs text-slate-500 dark:text-slate-500 hc:text-yellow-300/60 mt-2 italic">
                    Note: This viewer uses a placeholder model. In a full pipeline, this would display the 3D model of your product, "{projectName || 'Smart Coffee Mug'}".
                </p>
            </div>
            <div className="relative w-full aspect-video">
                {!isSupported && (
                     <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                        <p className="text-center text-slate-600 dark:text-slate-400">
                            {mode} is not supported on your browser or device.
                        </p>
                    </div>
                )}
                <Canvas style={{ background: 'transparent' }}>
                    <ambientLight intensity={1.5} />
                    <pointLight position={[5, 5, 5]} intensity={50} />
                    <XR>
                        <Controllers />
                        <Hands />
                        <ProductModel position={[0, mode === 'VR' ? 1.5 : 0, -0.5]} />
                         {/* Simple floor for VR environment */}
                        {mode === 'VR' && (
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,0,0]}>
                                <planeGeometry args={[10, 10]} />
                                <meshStandardMaterial color="#64748b" />
                            </mesh>
                        )}
                    </XR>
                </Canvas>
                <div className="absolute bottom-4 right-4 z-10">
                    {mode === 'AR' ? <ARButton sessionInit={{ requiredFeatures: ['hit-test'] }} /> : <VRButton />}
                </div>
            </div>
        </div>
    );
};

export default XRViewer;