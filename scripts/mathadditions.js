// Arrow notation functions, should be self explanatory
const deg2rad   = (degrees)           => degrees * PI / 180; // PI is a p5 constant, seemingly same as Math.PI
const clamp     = (val, min, max)     => Math.min(Math.max(val, min), max); // keep val between min & max
const trimSmall = (val, cutoff = 0.1) => Math.abs(val) > cutoff ? val : 0; // set val to 0 if it's too small