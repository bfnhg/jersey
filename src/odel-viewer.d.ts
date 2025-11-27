// src/model-viewer.d.ts

declare namespace JSX {
    interface IntrinsicElements {
        // Déclare la balise 'model-viewer'
        // 'any' est utilisé pour accepter tous les attributs custom (src, auto-rotate, etc.)
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            src: string;
            alt?: string;
            'auto-rotate'?: boolean;
            'camera-controls'?: boolean;
            'shadow-intensity'?: string | number;
            exposure?: string | number;
            poster?: string;
            ar?: boolean;
            'ar-modes'?: string;
            style?: React.CSSProperties; // pour accepter le style inline
            slot?: string; // pour les éléments enfants (comme le bouton AR)
            // Ajoutez ici d'autres attributs si nécessaire (ex: 'disable-zoom')
            [key: string]: any; // Pour attraper tous les attributs non listés
        };
    }
}

// Optionnel: Si vous utilisez des références ou des événements spécifiques
// declare global {
//     namespace JSX {
//         interface IntrinsicElements {
//             'model-viewer': any;
//         }
//     }
// }