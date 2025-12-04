export interface PlanetData {
  name: string;
  radius: number; // Relative to Earth = 1
  distance: number; // Distance from sun
  speed: number; // Orbit speed
  color: string; // Fallback color
  textureUrl: string;
  description?: string;
  hasRings?: boolean;
  ringTextureUrl?: string;
}

export interface HandControlState {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (bottom to top)
  isPinching: boolean;
  isActive: boolean;
}

export interface AIResponse {
  text: string;
  loading: boolean;
  error?: string;
}