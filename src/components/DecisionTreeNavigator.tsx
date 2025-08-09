import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Home, RotateCcw, CheckCircle, Info } from 'lucide-react';
import { DecisionTree, DecisionNode, NavigationHistory, Device } from '../types';

interface DecisionTreeNavigatorProps {
  device: Device;
  decisionTree: DecisionTree;
  onBackToDevices: () => void;
}

export const DecisionTreeNavigator: React.FC<DecisionTreeNavigatorProps> = ({
  device,
  decisionTree,
  onBackToDevices,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState(decisionTree.rootNodeId);
  const [history, setHistory] = useState<NavigationHistory[]>([]);

  const currentNode = decisionTree.nodes[currentNodeId];

  const handleOptionSelect = (optionId: string, nextNodeId?: string) => {
    if (nextNodeId) {
      setHistory([...history, { nodeId: currentNodeId, selectedOption: optionId }]);
      setCurrentNodeId(nextNodeId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousStep = history[history.length - 1];
      setCurrentNodeId(previousStep.nodeId);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setCurrentNodeId(decisionTree.rootNodeId);
    setHistory([]);
  };

  const isTerminalNode = (node: DecisionNode) => {
    return node.isTerminal || node.options.some(option => option.solution);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToDevices}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-900 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Back to Devices</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{device.name}</h1>
              <p className="text-sm text-gray-600">Model: {device.model}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleBack}
              disabled={history.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                history.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        {history.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Step {history.length + 1} of troubleshooting</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(((history.length + 1) / 5) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentNode.question}
          </h2>
          {currentNode.description && (
            <p className="text-gray-600 text-lg">
              {currentNode.description}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentNode.options.map((option) => {
            const hasSolution = option.solution;
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.nextNodeId)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  hasSolution
                    ? 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100'
                    : 'border-gray-200 bg-gray-50 hover:border-red-900 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {hasSolution ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="text-lg font-medium text-gray-900">
                        {option.text}
                      </span>
                    </div>
                    
                    {option.solution && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                            <p className="text-green-700">{option.solution}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Node Solutions */}
      {isTerminalNode(currentNode) && currentNode.solution && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Recommended Solution
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {currentNode.solution}
              </p>
              
              {currentNode.additionalInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Additional Information:</h4>
                      <p className="text-blue-700 text-sm">{currentNode.additionalInfo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};