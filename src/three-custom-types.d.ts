import * as THREE from 'three'; 

// 1. Déclaration de l'interface pour toutes les balises 3D de base
interface ThreeElements extends JSX.IntrinsicElements {
    // Lumières
    ambientLight: JSX.IntrinsicElements['ambientLight'] & Partial<THREE.AmbientLight>;
    directionalLight: JSX.IntrinsicElements['directionalLight'] & Partial<THREE.DirectionalLight>;
    pointLight: JSX.IntrinsicElements['pointLight'] & Partial<THREE.PointLight>;
    spotLight: JSX.IntrinsicElements['spotLight'] & Partial<THREE.SpotLight>; 
}

// 2. Augmentation du module @react-three/fiber
declare module '@react-three/fiber' {
    // Utiliser 'ThreeElements' pour inclure toutes les lumières et éléments
    interface ExtendedIntrinsicElements extends ThreeElements {
        // Déclaration spécifique de la balise <primitive>
        primitive: JSX.IntrinsicElements['primitive'] & {
            object: THREE.Object3D;
            scale?: number | [number, number, number];
            rotation?: [number, number, number];
        };
    }
}