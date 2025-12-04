import { PlanetData } from './types';

// Using a stable GitHub repository for textures
const TEXTURE_PATH = "https://raw.githubusercontent.com/manomaxx/solar-system-threejs/master/public/img";

export const SOLAR_SYSTEM_DATA: PlanetData[] = [
  { 
    name: "Mercury", 
    radius: 0.38, 
    distance: 10, 
    speed: 0.04, 
    color: "#A0A0A0",
    textureUrl: `${TEXTURE_PATH}/mercury.jpg`
  },
  { 
    name: "Venus", 
    radius: 0.95, 
    distance: 15, 
    speed: 0.015, 
    color: "#E3BB76",
    textureUrl: `${TEXTURE_PATH}/venus.jpg`
  },
  { 
    name: "Earth", 
    radius: 1, 
    distance: 20, 
    speed: 0.01, 
    color: "#22A6B3",
    textureUrl: `${TEXTURE_PATH}/earth.jpg`
  },
  { 
    name: "Mars", 
    radius: 0.53, 
    distance: 25, 
    speed: 0.008, 
    color: "#EB4D4B",
    textureUrl: `${TEXTURE_PATH}/mars.jpg`
  },
  { 
    name: "Jupiter", 
    radius: 11.2, 
    distance: 35, 
    speed: 0.002, 
    color: "#F9CA24",
    textureUrl: `${TEXTURE_PATH}/jupiter.jpg`
  },
  { 
    name: "Saturn", 
    radius: 9.45, 
    distance: 50, 
    speed: 0.0009, 
    color: "#F0932B", 
    textureUrl: `${TEXTURE_PATH}/saturn.jpg`,
    hasRings: true,
    ringTextureUrl: `${TEXTURE_PATH}/saturn-ring.png`
  },
  { 
    name: "Uranus", 
    radius: 4.0, 
    distance: 65, 
    speed: 0.0004, 
    color: "#7ED6DF",
    textureUrl: `${TEXTURE_PATH}/uranus.jpg`
  },
  { 
    name: "Neptune", 
    radius: 3.88, 
    distance: 80, 
    speed: 0.0001, 
    color: "#686DE0",
    textureUrl: `${TEXTURE_PATH}/neptune.jpg`
  },
];

export const SUN_TEXTURE_URL = `${TEXTURE_PATH}/sun.jpg`;

export const CAMERA_START_POS = [0, 20, 60];
