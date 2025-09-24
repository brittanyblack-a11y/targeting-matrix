import React, { useState, useMemo } from 'react';
import { Filter, Download, RotateCcw } from 'lucide-react';

const TargetingMatrix = () => {
  // Sample data - replace with your actual geos and products
  const geos = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Japan', 'Brazil', 'India', 'Mexico', 
    'Spain', 'Italy', 'Netherlands', 'Sweden', 'Singapore'
  ];
  
  const products = [
    'Product A', 'Product B', 'Product C', 'Product D', 'Product E',
    'Product F', 'Product G', 'Product H', 'Product I', 'Product J'
  ];
  
  const businessUnits = ['IMC', 'BAU Social', 'BAU Search', 'BAU Display'];
  
  // State for tracking which combinations are selected for each business unit
  const [targeting, setTargeting] = useState(() => {
    const initial = {};
    businessUnits.forEach(unit => {
      initial[unit] = {};
      geos.forEach(geo => {
        initial[unit][geo] = {};
        products.forEach(product => {
          initial[unit][geo][product] = Math.random() > 0.7; // Random initial state
        });
      });
    });
    return initial;
  });
  
  // Filter states
  const [selectedGeos, setSelectedGeos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState(businessUnits);
  
  // Filtered data
  const filteredGeos = selectedGeos.length > 0 ? selectedGeos : geos;
  const filteredProducts = selectedProducts.length > 0 ? selectedProducts : products;
  const filteredBusinessUnits = selectedBusinessUnits;
  
  // Toggle targeting for a specific combination
  const toggleTargeting = (unit, geo, product) => {
    setTargeting(prev => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        [geo]: {
          ...prev[unit][geo],
          [product]: !prev[unit][geo][product]
        }
      }
    }));
  };
  
  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const stats = {};
    businessUnits.forEach(unit => {
      const totalCombinations = geos.length * products.length;
      const activeCombinations = geos.reduce((sum, geo) => {
        return sum + products.reduce((geoSum, product) => {
          return geoSum + (targeting[unit][geo][product] ? 1 : 0);
        }, 0);
      }, 0);
      stats[unit] = {
        active: activeCombinations,
        total: totalCombinations,
        percentage: Math.round((activeCombinations / totalCombinations) * 100)
      };
    });
    return stats;
  }, [targeting]);
  
  // Reset all targeting
  const resetAll = () => {
    setTargeting(prev => {
      const reset = {};
      businessUnits.forEach(unit => {
        reset[unit] = {};
        geos.forEach(geo => {
          reset[unit][geo] = {};
          products.forEach(product => {
            reset[unit][geo][product] = false;
          });
        });
      });
      return reset;
    });
  };
  
  // Export data (placeholder)
  const exportData = () => {
    const exportableData = [];
    businessUnits.forEach(unit => {
      geos.forEach(geo => {
        products.forEach(product => {
          if (targeting[unit][geo][product]) {
            exportableData.push({ unit, geo, product });
          }
        });
      });
    });
    console.log('Export data:', exportableData);
    alert(`Would export ${exportableData.length} targeting combinations to CSV`);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Business Unit Targeting Matrix</h1>
            <div className="flex gap-2">
              <button 
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <RotateCcw size={16} />
                Reset All
              </button>
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {businessUnits.map(unit => (
              <div key={unit} className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-sm text-gray-700">{unit}</h3>
                <p className="text-lg font-bold text-blue-600">
                  {summaryStats[unit]?.active || 0}/{summaryStats[unit]?.total || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {summaryStats[unit]?.percentage || 0}% coverage
                </p>
              </div>
            ))}
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select 
              multiple
              className="border border-gray-300 rounded px-2 py-1 text-sm max-w-xs"
              value={selectedGeos}
              onChange={(e) => setSelectedGeos(Array.from(e.target.selectedOptions, option => option.value))}
            >
              <option value="" disabled>Select Geos (Ctrl+click for multiple)</option>
              {geos.map(geo => (
                <option key={geo} value={geo}>{geo}</option>
              ))}
            </select>
            
            <select 
              multiple
              className="border border-gray-300 rounded px-2 py-1 text-sm max-w-xs"
              value={selectedProducts}
              onChange={(e) => setSelectedProducts(Array.from(e.target.selectedOptions, option => option.value))}
            >
              <option value="" disabled>Select Products (Ctrl+click for multiple)</option>
              {products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {/* Left sidebar with geo/product labels */}
            <div className="sticky left-0 bg-white border-r border-gray-200 z-10">
              {/* Header spacer */}
              <div className="h-12 border-b border-gray-200 bg-gray-50"></div>
              
              {/* Geo rows */}
              {filteredGeos.map(geo => (
                <div key={geo} className="border-b border-gray-100">
                  <div className="p-2 bg-gray-50 font-medium text-sm text-gray-700 border-b border-gray-200">
                    {geo}
                  </div>
                  {filteredProducts.map(product => (
                    <div key={`${geo}-${product}`} className="p-2 text-xs text-gray-600 border-b border-gray-100 h-10 flex items-center bg-white">
                      {product}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Business unit columns */}
            {filteredBusinessUnits.map(unit => (
              <div key={unit} className="border-r border-gray-200 min-w-48">
                {/* Header */}
                <div className="h-12 bg-blue-500 text-white p-2 flex items-center justify-center font-semibold border-b border-gray-200">
                  {unit}
                </div>
                
                {/* Data grid */}
                {filteredGeos.map(geo => (
                  <div key={geo} className="border-b border-gray-100">
                    {/* Geo header for this unit */}
                    <div className="p-2 bg-blue-50 text-xs font-medium text-blue-700 border-b border-gray-200 text-center">
                      Coverage: {products.reduce((sum, prod) => sum + (targeting[unit][geo][prod] ? 1 : 0), 0)}/{products.length}
                    </div>
                    
                    {/* Product checkboxes */}
                    {filteredProducts.map(product => (
                      <div key={`${geo}-${product}`} className="h-10 flex items-center justify-center border-b border-gray-100 bg-white hover:bg-gray-50">
                        <label className="cursor-pointer flex items-center">
                          <input
                            type="checkbox"
                            checked={targeting[unit][geo][product]}
                            onChange={() => toggleTargeting(unit, geo, product)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          <p>Total possible combinations: {geos.length * products.length * businessUnits.length}</p>
          <p>Active combinations: {Object.values(summaryStats).reduce((sum, stat) => sum + stat.active, 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default TargetingMatrix;