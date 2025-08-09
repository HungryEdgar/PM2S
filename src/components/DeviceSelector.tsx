import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Device } from '../types';

interface DeviceSelectorProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  onDeviceSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState<'all' | 'coreDevice' | 'brandName'>('all');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>('');

  // Get unique core devices and brand names
  const coreDevices = Array.from(new Set(devices.map(d => d.coreDevice))).sort();
  const brandNames = Array.from(new Set(devices.map(d => d.brandName))).sort();
  
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilterType === 'coreDevice' && selectedFilterValue) {
      matchesFilter = device.coreDevice === selectedFilterValue;
    } else if (selectedFilterType === 'brandName' && selectedFilterValue) {
      matchesFilter = device.brandName === selectedFilterValue;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleFilterTypeChange = (filterType: 'all' | 'coreDevice' | 'brandName') => {
    setSelectedFilterType(filterType);
    setSelectedFilterValue('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          L'Oréal Tech Support
        </h1>
        <p className="text-lg text-gray-600">
          Select a device to begin troubleshooting
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
          />
        </div>

        {/* Filter Type Selection */}
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={() => handleFilterTypeChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilterType === 'all'
                ? 'bg-red-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Devices
          </button>
          <button
            onClick={() => handleFilterTypeChange('coreDevice')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilterType === 'coreDevice'
                ? 'bg-red-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Core Device
          </button>
          <button
            onClick={() => handleFilterTypeChange('brandName')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilterType === 'brandName'
                ? 'bg-red-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Brand
          </button>
        </div>

        {/* Filter Value Selection */}
        {selectedFilterType !== 'all' && (
          <div className="flex justify-center flex-wrap gap-2">
            {selectedFilterType === 'coreDevice' && coreDevices.map(coreDevice => (
              <button
                key={coreDevice}
                onClick={() => setSelectedFilterValue(selectedFilterValue === coreDevice ? '' : coreDevice)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilterValue === coreDevice
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {coreDevice}
              </button>
            ))}
            {selectedFilterType === 'brandName' && brandNames.map(brandName => (
              <button
                key={brandName}
                onClick={() => setSelectedFilterValue(selectedFilterValue === brandName ? '' : brandName)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilterValue === brandName
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {brandName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Filter Display */}
      {selectedFilterType !== 'all' && selectedFilterValue && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm">
            <span>
              Showing {selectedFilterType === 'coreDevice' ? 'Core Device' : 'Brand'}: 
              <strong className="ml-1">{selectedFilterValue}</strong>
            </span>
            <button
              onClick={() => setSelectedFilterValue('')}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map(device => (
          <div
            key={device.id}
            onClick={() => onDeviceSelect(device)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-red-900"
          >
            <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden">
              {device.imageUrl && (
                <img
                  src={device.imageUrl}
                  alt={device.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Model: {device.model}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {device.coreDevice}
                    </span>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {device.brandName}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-900 transition-colors ml-2 flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No devices found matching your search.</p>
        </div>
      )}
    </div>
  );
};