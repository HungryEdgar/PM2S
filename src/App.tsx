import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { DeviceSelector } from './components/DeviceSelector';
import { DecisionTreeNavigator } from './components/DecisionTreeNavigator';
import { SettingsPanel } from './components/SettingsPanel';
import { devices } from './data/devices';
import { decisionTrees } from './data/decisionTrees';
import { Device, DecisionTree } from './types';

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentDevices, setCurrentDevices] = useState<Device[]>(devices);
  const [currentDecisionTrees, setCurrentDecisionTrees] = useState<Record<string, DecisionTree>>(decisionTrees);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deviceRes, treeRes] = await Promise.all([
          fetch('/devices'),
          fetch('/decision-trees')
        ]);
        if (deviceRes.ok) {
          const data = await deviceRes.json();
          setCurrentDevices(data);
        }
        if (treeRes.ok) {
          const trees = await treeRes.json();
          setCurrentDecisionTrees(trees);
        }
      } catch (err) {
        console.warn('Failed to load data from server', err);
      }
    };
    fetchData();
  }, []);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleBackToDevices = () => {
    setSelectedDevice(null);
  };

  const selectedDecisionTree = selectedDevice ? currentDecisionTrees[selectedDevice.id] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-6 left-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-red-900 z-40"
        title="Settings"
      >
        <Settings className="h-6 w-6 text-gray-600 hover:text-red-900 transition-colors" />
      </button>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        devices={currentDevices}
        decisionTrees={currentDecisionTrees}
        onUpdateDevices={setCurrentDevices}
        onUpdateDecisionTrees={setCurrentDecisionTrees}
      />

      {!selectedDevice ? (
        <DeviceSelector
          devices={currentDevices}
          onDeviceSelect={handleDeviceSelect}
        />
      ) : selectedDecisionTree ? (
        <DecisionTreeNavigator
          device={selectedDevice}
          decisionTree={selectedDecisionTree}
          onBackToDevices={handleBackToDevices}
        />
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Decision Tree Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              The troubleshooting guide for {selectedDevice.name} is not yet available.
              Please contact a supervisor or check for updated procedures.
            </p>
            <button
              onClick={handleBackToDevices}
              className="px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              Back to Device Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;