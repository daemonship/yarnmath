import { useState } from 'react';
import { calculateSkeinsNeeded, adjustYardageForGauge, convertUnits, calculateCost, shouldShowCrossWeightWarning } from '../utils/calculator.js';
import YarnWeightModal from './YarnWeightModal.jsx';

const YARN_WEIGHTS = [
  { value: 0, label: 'Lace' },
  { value: 1, label: 'Fingering' },
  { value: 2, label: 'Sport' },
  { value: 3, label: 'DK' },
  { value: 4, label: 'Worsted' },
  { value: 5, label: 'Bulky' },
  { value: 6, label: 'Super Bulky' },
  { value: 7, label: 'Jumbo' },
];

// Helper: convert yards to display value based on unit
function yardsToDisplay(yards, isMetric) {
  if (yards === '' || isNaN(yards)) return '';
  const yardsNum = parseFloat(yards);
  if (isMetric) {
    const meters = convertUnits(yardsNum, 'yards', 'meters');
    if (meters instanceof Error) return yardsNum.toFixed(1);
    return meters.toFixed(1);
  }
  return yardsNum.toFixed(1);
}

// Helper: parse display value back to yards
function displayToYards(display, isMetric) {
  if (display === '' || isNaN(display)) return '';
  const displayNum = parseFloat(display);
  if (isMetric) {
    const yards = convertUnits(displayNum, 'meters', 'yards');
    if (yards instanceof Error) return displayNum;
    return yards;
  }
  return displayNum;
}

export default function CalculatorForm() {
  // State for raw values (always in yards)
  const [patternYardageYards, setPatternYardageYards] = useState('');
  const [patternWeight, setPatternWeight] = useState(3); // DK default
  const [patternGauge, setPatternGauge] = useState(''); // stitches per 4 inches (value unchanged by unit)
  const [substituteWeight, setSubstituteWeight] = useState(3);
  const [substituteYardageYards, setSubstituteYardageYards] = useState('');
  const [substituteGauge, setSubstituteGauge] = useState('');
  const [pricePerSkein, setPricePerSkein] = useState('');
  
  // Unit toggle: true = metric, false = imperial
  const [isMetric, setIsMetric] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Results
  const [results, setResults] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handlers for yardage inputs (convert display to yards)
  const handlePatternYardageChange = (e) => {
    const displayValue = e.target.value;
    // Allow only numbers and decimal
    if (displayValue === '' || /^\d*\.?\d*$/.test(displayValue)) {
      const yards = displayToYards(displayValue, isMetric);
      setPatternYardageYards(yards.toString());
    }
  };
  
  const handleSubstituteYardageChange = (e) => {
    const displayValue = e.target.value;
    if (displayValue === '' || /^\d*\.?\d*$/.test(displayValue)) {
      const yards = displayToYards(displayValue, isMetric);
      setSubstituteYardageYards(yards.toString());
    }
  };
  
  // Handlers for gauge and price (no unit conversion)
  const handlePatternGaugeChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPatternGauge(value);
    }
  };
  
  const handleSubstituteGaugeChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSubstituteGauge(value);
    }
  };
  
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPricePerSkein(value);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    const patternYardageNum = parseFloat(patternYardageYards);
    if (!patternYardageYards.trim()) {
      newErrors.patternYardage = 'Pattern yardage is required';
    } else if (isNaN(patternYardageNum) || patternYardageNum <= 0) {
      newErrors.patternYardage = 'Pattern yardage must be greater than 0';
    }
    
    const substituteYardageNum = parseFloat(substituteYardageYards);
    if (!substituteYardageYards.trim()) {
      newErrors.substituteYardage = 'Skein yardage is required';
    } else if (isNaN(substituteYardageNum) || substituteYardageNum <= 0) {
      newErrors.substituteYardage = 'Skein yardage must be greater than 0';
    }
    
    // Optional gauge validation
    if (patternGauge.trim()) {
      const patternGaugeNum = parseFloat(patternGauge);
      if (isNaN(patternGaugeNum) || patternGaugeNum <= 0) {
        newErrors.patternGauge = 'Pattern gauge must be greater than 0';
      }
    }
    if (substituteGauge.trim()) {
      const substituteGaugeNum = parseFloat(substituteGauge);
      if (isNaN(substituteGaugeNum) || substituteGaugeNum <= 0) {
        newErrors.substituteGauge = 'Substitute gauge must be greater than 0';
      }
    }
    
    if (pricePerSkein.trim()) {
      const priceNum = parseFloat(pricePerSkein);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.pricePerSkein = 'Price cannot be negative';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Track successful calculation with Plausible
  const trackCalculation = () => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('Calculate');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setResults(null);
      return;
    }
    
    const patternYardageNum = parseFloat(patternYardageYards);
    let yardageToUse = patternYardageNum;
    
    // Apply gauge adjustment if both gauges provided
    if (patternGauge.trim() && substituteGauge.trim()) {
      const patternGaugeNum = parseFloat(patternGauge);
      const substituteGaugeNum = parseFloat(substituteGauge);
      const adjusted = adjustYardageForGauge(patternYardageNum, patternGaugeNum, substituteGaugeNum);
      if (!(adjusted instanceof Error)) {
        yardageToUse = adjusted;
      }
    }
    
    const substituteYardageNum = parseFloat(substituteYardageYards);
    const skeinsResult = calculateSkeinsNeeded(yardageToUse, substituteYardageNum);
    
    if (skeinsResult instanceof Error) {
      setErrors({ substituteYardage: skeinsResult.message });
      setResults(null);
      return;
    }
    
    let cost = null;
    if (pricePerSkein.trim()) {
      const price = parseFloat(pricePerSkein);
      const costResult = calculateCost(skeinsResult.skeins, price);
      if (!(costResult instanceof Error)) {
        cost = costResult;
      }
    }
    
    setResults({
      skeins: skeinsResult.skeins,
      totalYardage: skeinsResult.totalYardage,
      surplus: skeinsResult.surplus,
      cost,
      adjustedYardage: yardageToUse,
    });
    
    // Track successful calculation with Plausible
    trackCalculation();
  };
  
  const handleUnitToggle = () => {
    setIsMetric(!isMetric);
  };
  
  // Determine if cross-weight warning should be shown
  const showCrossWeightWarning = shouldShowCrossWeightWarning(patternWeight, substituteWeight);
  
  // Get display units
  const yardageUnit = isMetric ? 'meters' : 'yards';
  const gaugeUnit = isMetric ? 'per 10 cm' : 'per 4 inches';
  
  // Display values for inputs
  const patternYardageDisplay = yardsToDisplay(patternYardageYards, isMetric);
  const substituteYardageDisplay = yardsToDisplay(substituteYardageYards, isMetric);
  
  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Pattern details */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pattern Details</h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
              data-testid="yarn-weight-reference-button"
            >
              Yarn Weight Reference
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pattern Yardage ({yardageUnit})
            </label>
            <input
              type="text"
              name="patternYardage"
              data-testid="pattern-yardage-input"
              value={patternYardageDisplay}
              onChange={handlePatternYardageChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.patternYardage ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 1200"
            />
            {errors.patternYardage && (
              <p className="mt-1 text-sm text-red-600" data-testid="error-pattern-yardage">
                {errors.patternYardage}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yarn Weight (CYC)
            </label>
            <select
              name="patternWeight"
              value={patternWeight}
              onChange={(e) => setPatternWeight(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {YARN_WEIGHTS.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.value}: {weight.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stitch Gauge ({gaugeUnit})
            </label>
            <input
              type="text"
              name="patternGauge"
              value={patternGauge}
              onChange={handlePatternGaugeChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.patternGauge ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 18"
            />
            {errors.patternGauge && (
              <p className="mt-1 text-sm text-red-600" data-testid="error-pattern-gauge">
                {errors.patternGauge}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Optional: stitches per 4 inches (or per 10 cm if metric)
            </p>
          </div>
        </div>
        
        {/* Right column: Substitute yarn details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Substitute Yarn</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yarn Weight (CYC)
            </label>
            <select
              name="substituteWeight"
              value={substituteWeight}
              onChange={(e) => setSubstituteWeight(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {YARN_WEIGHTS.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.value}: {weight.label}
                </option>
              ))}
            </select>
          </div>
          
          {showCrossWeightWarning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md" data-testid="cross-weight-warning">
              <p className="text-sm text-yellow-800">
                ⚠️ These yarn weights differ by more than 1 category. The fabric may have a different drape or thickness.
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yardage per Skein ({yardageUnit})
            </label>
            <input
              type="text"
              name="skeinYardage"
              data-testid="skein-yardage-input"
              value={substituteYardageDisplay}
              onChange={handleSubstituteYardageChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.substituteYardage ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 220"
            />
            {errors.substituteYardage && (
              <p className="mt-1 text-sm text-red-600" data-testid="error-skein-yardage">
                {errors.substituteYardage}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Skein ($)
            </label>
            <input
              type="text"
              name="pricePerSkein"
              data-testid="price-per-skein-input"
              value={pricePerSkein}
              onChange={handlePriceChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.pricePerSkein ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 9.50 (optional)"
            />
            {errors.pricePerSkein && (
              <p className="mt-1 text-sm text-red-600" data-testid="error-price-per-skein">
                {errors.pricePerSkein}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stitch Gauge ({gaugeUnit})
            </label>
            <input
              type="text"
              name="substituteGauge"
              value={substituteGauge}
              onChange={handleSubstituteGaugeChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.substituteGauge ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 20 (optional)"
            />
            {errors.substituteGauge && (
              <p className="mt-1 text-sm text-red-600" data-testid="error-substitute-gauge">
                {errors.substituteGauge}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Optional: stitches per 4 inches (or per 10 cm if metric)
            </p>
          </div>
        </div>
      </div>
      
      {/* Unit toggle and calculate button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="mr-3 text-sm font-medium text-gray-700">Units:</span>
          <button
            type="button"
            data-testid="toggle-units"
            onClick={handleUnitToggle}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-pressed={isMetric}
          >
            <span className="sr-only">Toggle metric/imperial</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isMetric ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
            <span className="absolute inset-0 flex justify-between items-center px-1">
              <span className="text-xs font-medium text-gray-900">yd</span>
              <span className="text-xs font-medium text-gray-900">m</span>
            </span>
          </button>
        </div>
        
        <button
          type="submit"
          data-testid="calculate-button"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Calculate
        </button>
      </div>
      
      {/* Results panel */}
      {results && (
        <div className="mt-8 bg-white shadow rounded-lg p-6" data-testid="results-panel">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-indigo-50 p-4 rounded-md">
              <p className="text-sm font-medium text-indigo-700">Skeins Needed</p>
              <p className="text-2xl font-bold text-indigo-900" data-testid="skeins-needed">
                {results.skeins}
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm font-medium text-green-700">Total Yardage ({yardageUnit})</p>
              <p className="text-2xl font-bold text-green-900" data-testid="total-yardage">
                {yardsToDisplay(results.totalYardage, isMetric)}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm font-medium text-blue-700">Surplus ({yardageUnit})</p>
              <p className="text-2xl font-bold text-blue-900" data-testid="surplus-yardage">
                {yardsToDisplay(results.surplus, isMetric)}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-sm font-medium text-purple-700">Estimated Cost</p>
              <p className="text-2xl font-bold text-purple-900" data-testid="cost-estimate">
                {results.cost !== null ? `$${results.cost.toFixed(2)}` : '—'}
              </p>
            </div>
          </div>
          
          {patternGauge.trim() && substituteGauge.trim() && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Yardage adjusted for gauge:{' '}
                <span data-testid="adjusted-yardage">{yardsToDisplay(results.adjustedYardage, isMetric)}</span> {yardageUnit}
                {results.adjustedYardage !== parseFloat(patternYardageYards) && (
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                    {results.adjustedYardage > parseFloat(patternYardageYards) ? 'Increased' : 'Decreased'} due to gauge difference
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Yarn Weight Reference Modal */}
      <YarnWeightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </form>
  );
}