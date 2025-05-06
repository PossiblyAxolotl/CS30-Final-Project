// Arrow notation functions, should be self explanatory
const deg2rad = (degrees) => degrees * Math.PI / 180;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max); // keep val between min & max