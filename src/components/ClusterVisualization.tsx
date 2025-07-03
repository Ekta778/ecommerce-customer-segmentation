import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ClusterAnalysis } from '../types';

interface ClusterVisualizationProps {
  analysis: ClusterAnalysis;
  xFeature: string;
  yFeature: string;
}

export function ClusterVisualization({ analysis, xFeature, yFeature }: ClusterVisualizationProps) {
  const data = analysis.clusters.map(result => ({
    x: Number(result.data[xFeature]) || 0,
    y: Number(result.data[yFeature]) || 0,
    cluster: result.cluster,
    id: result.data.id,
    color: analysis.clusterSummaries[result.cluster]?.color || '#666'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.id}</p>
          <p className="text-sm text-gray-600">
            {xFeature}: {data.x.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {yFeature}: {data.y.toFixed(2)}
          </p>
          <p className="text-sm font-medium" style={{ color: data.color }}>
            {analysis.clusterSummaries[data.cluster]?.name || `Cluster ${data.cluster}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Cluster Visualization</h3>
        <p className="text-sm text-gray-600">
          {xFeature} vs {yFeature} • Silhouette Score: {analysis.silhouetteScore.toFixed(3)}
        </p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="x" 
              name={xFeature}
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis 
              dataKey="y" 
              name={yFeature}
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter dataKey="y">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}