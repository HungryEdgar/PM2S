import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, XCircle, Upload, FileText } from 'lucide-react';
import { Device, DecisionTree } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  decisionTrees: Record<string, DecisionTree>;
  onUpdateDevices: (devices: Device[]) => void;
  onUpdateDecisionTrees: (trees: Record<string, DecisionTree>) => void;
}

interface DeviceFormData {
  id: string;
  name: string;
  model: string;
  coreDevice: string;
  brandName: string;
  imageUrl: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  devices,
  decisionTrees,
  onUpdateDevices,
  onUpdateDecisionTrees,
}) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'procedures'>('devices');
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [importingDeviceId, setImportingDeviceId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [deviceForm, setDeviceForm] = useState<DeviceFormData>({
    id: '',
    name: '',
    model: '',
    coreDevice: '',
    brandName: '',
    imageUrl: ''
  });

  const resetDeviceForm = () => {
    setDeviceForm({
      id: '',
      name: '',
      model: '',
      coreDevice: '',
      brandName: '',
      imageUrl: ''
    });
  };

  const handleAddDevice = () => {
    setIsAddingDevice(true);
    resetDeviceForm();
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setDeviceForm({
      id: device.id,
      name: device.name,
      model: device.model,
      coreDevice: device.coreDevice,
      brandName: device.brandName,
      imageUrl: device.imageUrl || ''
    });
  };

  const handleSaveDevice = async () => {
    if (!deviceForm.name || !deviceForm.model || !deviceForm.coreDevice || !deviceForm.brandName) {
      alert('Please fill in all required fields');
      return;
    }

    const deviceId = deviceForm.id || `${deviceForm.coreDevice.toLowerCase().replace(/\s+/g, '-')}-${deviceForm.brandName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const newDevice: Device = {
      id: deviceId,
      name: deviceForm.name,
      model: deviceForm.model,
      coreDevice: deviceForm.coreDevice,
      brandName: deviceForm.brandName,
      imageUrl: deviceForm.imageUrl || undefined
    };

    try {
      const res = await fetch('/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdateDevices(updated);
        setEditingDevice(null);
        setIsAddingDevice(false);
        resetDeviceForm();
      } else {
        alert('Failed to save device');
      }
    } catch {
      alert('Failed to save device');
    }
  };

  const handleCancelEdit = () => {
    setEditingDevice(null);
    setIsAddingDevice(false);
    resetDeviceForm();
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device? This will also remove its associated procedures.')) {
      try {
        const res = await fetch(`/devices/${deviceId}`, { method: 'DELETE' });
        if (res.ok) {
          const updatedDevices = await res.json();
          onUpdateDevices(updatedDevices);
        }
        const treeRes = await fetch(`/decision-trees/${deviceId}`, { method: 'DELETE' });
        if (treeRes.ok) {
          const updatedTrees = await treeRes.json();
          onUpdateDecisionTrees(updatedTrees);
        }
      } catch {
        alert('Failed to delete device');
      }
    }
  };

  const handleDeleteProcedure = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this procedure?')) {
      try {
        const res = await fetch(`/decision-trees/${deviceId}`, { method: 'DELETE' });
        if (res.ok) {
          const updatedTrees = await res.json();
          onUpdateDecisionTrees(updatedTrees);
        }
      } catch {
        alert('Failed to delete procedure');
      }
    }
  };

  const handleImportClick = (deviceId: string) => {
    setImportingDeviceId(deviceId);
    setImportError(null);
    const fileInput = document.getElementById('procedure-file-input') as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);

        if (!parsedData.rootNodeId || !parsedData.nodes) {
          setImportError('Invalid decision tree format. Must contain "rootNodeId" and "nodes" properties.');
          return;
        }
        if (typeof parsedData.nodes !== 'object' || Array.isArray(parsedData.nodes)) {
          setImportError('Invalid nodes format. "nodes" must be an object.');
          return;
        }
        if (!parsedData.nodes[parsedData.rootNodeId]) {
          setImportError(`Root node "${parsedData.rootNodeId}" not found in nodes.`);
          return;
        }
        if (!importingDeviceId) {
          setImportError('No device selected for import.');
          return;
        }

        const newDecisionTree: DecisionTree = {
          deviceId: importingDeviceId,
          rootNodeId: parsedData.rootNodeId,
          nodes: parsedData.nodes
        };

        const res = await fetch('/decision-trees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDecisionTree)
        });
        if (res.ok) {
          const updatedTrees = await res.json();
          onUpdateDecisionTrees(updatedTrees);
          setImportingDeviceId(null);
          setImportError(null);
          const device = devices.find(d => d.id === importingDeviceId);
          alert(`Decision tree successfully imported for ${device?.name || 'device'}!`);
        } else {
          setImportError('Failed to save decision tree');
        }
      } catch (error) {
        setImportError(`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    reader.onerror = () => {
      setImportError('Failed to read file');
    };

    reader.readAsText(file);

    // Clear the input value to allow re-importing the same file
    event.target.value = '';
  };

  const getUniqueValues = (field: 'coreDevice' | 'brandName') => {
    return Array.from(new Set(devices.map(d => d[field]))).sort();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Hidden file input for JSON import */}
      <input
        id="procedure-file-input"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'devices'
                ? 'text-red-900 border-b-2 border-red-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Devices
          </button>
          <button
            onClick={() => setActiveTab('procedures')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'procedures'
                ? 'text-red-900 border-b-2 border-red-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Procedures
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'devices' && (
            <div>
              {/* Add Device Button */}
              <div className="mb-6">
                <button
                  onClick={handleAddDevice}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Device</span>
                </button>
              </div>

              {/* Device Form */}
              {(isAddingDevice || editingDevice) && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingDevice ? 'Edit Device' : 'Add New Device'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Device Name *
                      </label>
                      <input
                        type="text"
                        value={deviceForm.name}
                        onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                        placeholder="e.g., Hair Dryer Pro 2024"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Number *
                      </label>
                      <input
                        type="text"
                        value={deviceForm.model}
                        onChange={(e) => setDeviceForm({ ...deviceForm, model: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                        placeholder="e.g., HD-2024-PRO"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Core Device *
                      </label>
                      <input
                        type="text"
                        value={deviceForm.coreDevice}
                        onChange={(e) => setDeviceForm({ ...deviceForm, coreDevice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                        placeholder="e.g., Hair Dryer"
                        list="coreDevices"
                      />
                      <datalist id="coreDevices">
                        {getUniqueValues('coreDevice').map(value => (
                          <option key={value} value={value} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        value={deviceForm.brandName}
                        onChange={(e) => setDeviceForm({ ...deviceForm, brandName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                        placeholder="e.g., L'Oréal"
                        list="brandNames"
                      />
                      <datalist id="brandNames">
                        {getUniqueValues('brandName').map(value => (
                          <option key={value} value={value} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL (optional)
                      </label>
                      <input
                        type="url"
                        value={deviceForm.imageUrl}
                        onChange={(e) => setDeviceForm({ ...deviceForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSaveDevice}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Devices List */}
              <div className="space-y-4">
                {devices.map(device => (
                  <div key={device.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{device.name}</h4>
                        <p className="text-sm text-gray-600">Model: {device.model}</p>
                        <div className="flex space-x-2 mt-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {device.coreDevice}
                          </span>
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            {device.brandName}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDevice(device)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDevice(device.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'procedures' && (
            <div>
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">JSON Import Instructions</h4>
                      <p className="text-blue-700 text-sm mb-2">
                        Upload decision tree procedures as JSON files. Each file should contain:
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1 ml-4">
                        <li>• <code className="bg-blue-100 px-1 rounded">rootNodeId</code>: The starting node ID</li>
                        <li>• <code className="bg-blue-100 px-1 rounded">nodes</code>: Object containing all decision nodes</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {importError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Import Error</h4>
                        <p className="text-red-700 text-sm">{importError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {devices.map(device => {
                  const hasProcedure = decisionTrees[device.id];
                  return (
                    <div key={device.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{device.name}</h4>
                          <p className="text-sm text-gray-600">Model: {device.model}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              hasProcedure 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {hasProcedure ? 'Procedure Available' : 'No Procedure'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {hasProcedure ? (
                            <>
                              <button
                                onClick={() => handleImportClick(device.id)}
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                              >
                                <Upload className="h-3 w-3" />
                                <span>Re-import</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProcedure(device.id)}
                                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleImportClick(device.id)}
                              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                            >
                              <Upload className="h-3 w-3" />
                              <span>Import Procedure</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};