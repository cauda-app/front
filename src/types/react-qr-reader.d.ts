// Type definitions for react-qr-reader
// Definitions by: Josiah Nunemaker josnun.com

import * as React from 'react';

interface LoadInfo {
  mirrorVideo: boolean;
  streamLabel: string;
}

export interface ReaderProps {
  onScan: (result: string | null) => any;
  onError: (error: Error) => any;
  onLoad?: (loadInfo: LoadInfo) => any;
  onImageLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => any;

  delay?: number | false;
  facingMode?: 'user' | 'environment';
  legacyMode?: boolean;
  resolution?: number;
  showViewFinder?: boolean;
  style?: React.CSSProperties;
  className?: string;
  constraints?: MediaTrackConstraints;
}
