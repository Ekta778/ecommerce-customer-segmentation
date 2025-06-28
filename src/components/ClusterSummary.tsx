import React from 'react';
import { Users, TrendingUp, Target } from 'lucide-react';
import { ClusterSummary as ClusterSummaryType } from '../types';

interface ClusterSummaryProps {
  summaries: ClusterSummaryType[];
}

export function ClusterSummary({ summaries }: ClusterSummaryProps) {
  const formatValue = (value: number | string): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return String(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaries.map((summary) => (
        <div
          key={summary.clusterId}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: summary.color }}
              />
              <h3 className="font-semibold text-gray-900">{summary.name}</h3>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{summary.count}</span>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(summary.characteristics).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatValue(value)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Cluster Size</span>
              <div className="flex items-center space-x-1">
                <div className="w-12 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: summary.color,
                      width: `${(summary.count / Math.max(...summaries.map(s => s.count))) * 100}%`
                    }}
                  />
                </div>
                <span className="font-medium text-gray-700">
                  {((summary.count / summaries.reduce((sum, s) => sum + s.count, 0)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}