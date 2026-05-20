import { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LaboratoryOrderPanelProps {
  patientId: string | number;
  onClose: () => void;
}

const LAB_CATEGORIES = [
  {
    title: 'Blood tests',
    tests: ['FBC', 'RP', 'LFT', 'Glucose', 'INR/APTT', 'Amylase', 'hsTrop I', 'Calcium', 'Blood culture', 'Dengue combo']
  },
  {
    title: 'Urine',
    tests: ['UFEME', 'Urine culture', 'UPT']
  },
  {
    title: 'Imaging studies',
    tests: ['CXR', 'AXR', 'KUB XR', 'XR upper limb', 'XR lower limb', 'KUB U/S', 'HBS U/S', 'EFAST', 'Echo', 'CT brain', 'CTU', 'CT abdomen', 'CT spine', 'CT thorax', 'CTPA']
  },
  {
    title: 'Other tests',
    tests: ['ECG', 'ABG', 'VBG', 'Ketone']
  }
];

export function LaboratoryOrderPanel({ patientId, onClose }: LaboratoryOrderPanelProps) {
  const { orderLabs } = useApp();
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(LAB_CATEGORIES.map(c => c.title));

  const toggleTest = (test: string) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryTitle) 
        ? prev.filter(t => t !== categoryTitle) 
        : [...prev, categoryTitle]
    );
  };

  const handleConfirm = () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one lab test to order.');
      return;
    }
    orderLabs(patientId, selectedTests);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-clinical p-6 border-t-4 border-purple-500 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Order for lab test</h2>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {LAB_CATEGORIES.map((category) => (
          <div key={category.title} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.title)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 font-medium text-gray-800 transition-colors"
            >
              {category.title}
              <span className="text-gray-400 text-sm">
                {expandedCategories.includes(category.title) ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedCategories.includes(category.title) && (
              <div className="p-3 bg-white grid grid-cols-2 gap-2">
                {category.tests.map(test => (
                  <label key={test} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-purple-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test)}
                      onChange={() => toggleTest(test)}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{test}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        className={`w-full mt-6 px-4 py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2 ${
          selectedTests.length > 0 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        <FlaskConical className="w-4 h-4" />
        Confirm Selection ({selectedTests.length})
      </button>
    </div>
  );
}
