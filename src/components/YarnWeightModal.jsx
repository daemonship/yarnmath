import { useEffect, useCallback } from 'react';

const YARN_WEIGHT_DATA = [
  {
    category: 0,
    name: 'Lace',
    gaugeRange: '32–34+ stitches per 4 inches',
    needleRange: '1.5–2.25 mm / US 000–1',
    description: 'Fingering-weight held double, thread-like yarns'
  },
  {
    category: 1,
    name: 'Fingering / Sock',
    gaugeRange: '27–32 stitches per 4 inches',
    needleRange: '2.25–3.25 mm / US 1–3',
    description: 'Socks, shawls, fine garments'
  },
  {
    category: 2,
    name: 'Sport',
    gaugeRange: '23–26 stitches per 4 inches',
    needleRange: '3.25–3.5 mm / US 3–4',
    description: 'Lightweight sweaters, baby items'
  },
  {
    category: 3,
    name: 'DK (Double Knitting)',
    gaugeRange: '21–24 stitches per 4 inches',
    needleRange: '3.5–4.5 mm / US 4–7',
    description: 'Versatile weight for sweaters, accessories'
  },
  {
    category: 4,
    name: 'Worsted / Aran',
    gaugeRange: '16–20 stitches per 4 inches',
    needleRange: '4.5–5.5 mm / US 7–9',
    description: 'Most common weight for sweaters, blankets'
  },
  {
    category: 5,
    name: 'Bulky',
    gaugeRange: '12–15 stitches per 4 inches',
    needleRange: '5.5–8 mm / US 9–11',
    description: 'Quick knits, warm outerwear'
  },
  {
    category: 6,
    name: 'Super Bulky',
    gaugeRange: '7–11 stitches per 4 inches',
    needleRange: '8–12.75 mm / US 11–17',
    description: 'Very fast knitting, thick blankets'
  },
  {
    category: 7,
    name: 'Jumbo',
    gaugeRange: '6 or fewer stitches per 4 inches',
    needleRange: '12.75+ mm / US 17+',
    description: 'Arm knitting, extreme bulk'
  }
];

export default function YarnWeightModal({ isOpen, onClose }) {
  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
      data-testid="yarn-weight-modal"
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Yarn Weight Reference (CYC Standard)
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Craft Yarn Council standard yarn weight categories
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
            aria-label="Close modal"
            data-testid="close-modal-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typical Gauge
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Needle Size
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {YARN_WEIGHT_DATA.map((yarn) => (
                  <tr key={yarn.category} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {yarn.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {yarn.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {yarn.gaugeRange}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {yarn.needleRange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              About Yarn Weight Substitution
            </h3>
            <p className="text-sm text-blue-800">
              When substituting yarns, try to stay within 1 weight category of the original pattern 
              for best results. Larger differences may require significant gauge adjustments and 
              can affect the fabric drape and finished dimensions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            data-testid="modal-close-footer-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
