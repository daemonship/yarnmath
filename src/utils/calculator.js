/**
 * Calculator logic for yarn yardage calculations
 * These functions are pure math with no UI dependencies
 */

// Constants for unit conversion
const YARDS_TO_METERS = 0.9144
const INCHES_TO_CM = 2.54

/**
 * Calculate the number of skeins needed for a pattern
 * @param {number} patternYardage - Total yardage required by the pattern
 * @param {number} skeinYardage - Yardage per skein of the substitute yarn
 * @returns {Object} Object with skeins, totalYardage, and surplus
 * @throws {Error} If skeinYardage is zero or negative
 */
export function calculateSkeinsNeeded(patternYardage, skeinYardage) {
  // Validation
  if (patternYardage < 0 || skeinYardage < 0) {
    return new Error('Yardage values cannot be negative')
  }
  if (skeinYardage === 0) {
    return new Error('Skein yardage cannot be zero')
  }
  
  // Calculate skeins needed (ceiling to whole skeins)
  const skeins = Math.ceil(patternYardage / skeinYardage)
  const totalYardage = skeins * skeinYardage
  const surplus = totalYardage - patternYardage
  
  return { skeins, totalYardage, surplus }
}

/**
 * Adjust yardage based on gauge differences
 * @param {number} patternYardage - Original pattern yardage
 * @param {number} patternGauge - Pattern stitch gauge (stitches per 4 inches)
 * @param {number} substituteGauge - Substitute yarn stitch gauge (stitches per 4 inches)
 * @returns {number} Adjusted yardage
 * @throws {Error} If any parameter is invalid
 */
export function adjustYardageForGauge(patternYardage, patternGauge, substituteGauge) {
  // Validation
  if (patternYardage < 0 || patternGauge <= 0 || substituteGauge <= 0) {
    return new Error('Invalid gauge or yardage values')
  }
  
  // Adjusted yardage = patternYardage × substituteGauge / patternGauge
  // Tighter gauge (higher stitches per inch) needs more yarn
  const adjustedYardage = patternYardage * substituteGauge / patternGauge
  return adjustedYardage
}

/**
 * Convert between yards and meters
 * @param {number} value - The value to convert
 * @param {string} fromUnit - 'yards' or 'meters'
 * @param {string} toUnit - 'yards' or 'meters'
 * @returns {number} Converted value
 */
export function convertUnits(value, fromUnit, toUnit) {
  if (value < 0) {
    return new Error('Value cannot be negative')
  }
  
  // Normalize units
  const from = fromUnit.toLowerCase()
  const to = toUnit.toLowerCase()
  
  if (from === to) {
    return value
  }
  
  if (from === 'yards' && to === 'meters') {
    return value * YARDS_TO_METERS
  }
  
  if (from === 'meters' && to === 'yards') {
    return value / YARDS_TO_METERS
  }
  
  if (from === 'inches' && to === 'cm') {
    return value * INCHES_TO_CM
  }
  
  if (from === 'cm' && to === 'inches') {
    return value / INCHES_TO_CM
  }
  
  return new Error(`Unsupported conversion: ${fromUnit} to ${toUnit}`)
}

/**
 * Calculate cost estimate
 * @param {number} skeins - Number of skeins needed
 * @param {number} pricePerSkein - Price per skein
 * @returns {number} Total cost
 */
export function calculateCost(skeins, pricePerSkein) {
  if (skeins < 0 || pricePerSkein < 0) {
    return new Error('Invalid cost parameters')
  }
  return skeins * pricePerSkein
}

/**
 * Check if yarn weights differ by more than 1 category
 * CYC categories: 0=Lace, 1=Fingering, 2=Sport, 3=DK, 4=Worsted, 5=Bulky, 6=Super Bulky, 7=Jumbo
 * @param {number} patternWeight - Pattern yarn weight category (0-7)
 * @param {number} substituteWeight - Substitute yarn weight category (0-7)
 * @returns {boolean} True if cross-weight warning should be shown
 */
export function shouldShowCrossWeightWarning(patternWeight, substituteWeight) {
  const gap = Math.abs(patternWeight - substituteWeight)
  return gap > 1
}
