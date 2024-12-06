import { Principal } from '@dfinity/principal';

export const blobToPrincipal = (blob) => {
  if (!blob) return null;
  try {
    return Principal.fromUint8Array(blob).toString();
  } catch (error) {
    console.error('Error converting blob to principal:', error);
    return null;
  }
};
