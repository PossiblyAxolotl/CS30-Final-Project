// Arrow notation functions, should be self explanatory
const deg2rad   = (degrees)           => degrees * Math.PI / 180;
const clamp     = (val, min, max)     => Math.min(Math.max(val, min), max); // keep val between min & max
const trimSmall = (val, cutoff = 0.1) => Math.abs(val) > cutoff ? val : 0; // set val to 0 if it's too small