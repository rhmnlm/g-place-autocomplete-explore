import { useState, useEffect } from 'react';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
}

interface UseGoogleMapsResult {
  isLoaded: boolean;
  loadError: Error | null;
}

// export const useGoogleMaps = ({
//   apiKey,
//   libraries = ['places', 'maps'],
// }: UseGoogleMapsOptions): UseGoogleMapsResult => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [loadError, setLoadError] = useState<Error | null>(null);

//   useEffect(() => {
//     // Check if already loaded
//     if (window.google?.maps) {
//       setIsLoaded(true);
//       return;
//     }

//     // Check if script is already being loaded
//     const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
//     if (existingScript) {
//       existingScript.addEventListener('load', () => setIsLoaded(true));
//       return;
//     }

//     // Create and load script
//     const script = document.createElement('script');
//     script.id = GOOGLE_MAPS_SCRIPT_ID;
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&loading=async`;
//     script.async = true;
//     script.defer = true;

//     script.addEventListener('load', () => {
//       setIsLoaded(true);
//     });

//     script.addEventListener('error', () => {
//       setLoadError(new Error('Failed to load Google Maps script'));
//     });

//     document.head.appendChild(script);

//     return () => {
//       // Cleanup is not needed as we want to keep the script loaded
//     };
//   }, [apiKey, libraries]);

//   return { isLoaded, loadError };
// };

// export default useGoogleMaps;
