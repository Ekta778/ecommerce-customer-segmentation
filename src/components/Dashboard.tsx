import React, { useState, useMemo } from 'react';
import { Download, Settings, BarChart3, Filter, Users, Target } from 'lucide-react';
import { CustomerRecord, ClusterAnalysis } from '../types';
import { ClusterVisualization } from './ClusterVisualization';
import { ClusterSummary } from './ClusterSummary';
import { performClustering, findOptimalClusters } from '../utils/clustering';

interface DashboardProps {
  data: CustomerRecord[];
  onReset: () => void;
}

export function Dashboard({ data, onReset }: DashboardProps) {
  const [clusterCount, setClusterCount] = useState(4);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [xFeature, setXFeature] = useState('');
  const [yFeature, setYFeature] = useState('');

  // Get numeric features for visualization
  const numericFeatures = useMemo(() => {
    return Object.keys(data[0]).filter(key => 
      key !== 'id' && typeof data[0][key] === 'number'
    );
  }, [data]);

  // Set default features
  React.useEffect(() => {
    if (numericFeatures.length >= 2 && !xFeature) {
      setXFeature(numericFeatures[0]);
      setYFeature(numericFeatures[1]);
    }
  }, [numericFeatures, xFeature]);

  // Perform clustering analysis
  const analysis = useMemo(() => {
    try {
      return performClustering(data, clusterCount);
    } catch (error) {
      console.error('Clustering error:', error);
      return null;
    }
  }, [data, clusterCount]);

  // Find optimal cluster count
  const optimalAnalysis = useMemo(() => {
    return findOptimalClusters(data);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!analysis || selectedCluster === null) return data;
    return analysis.clusters
      .filter(result => result.cluster === selectedCluster)
      .map(result => result.data);
  }, [analysis, selectedCluster, data]);

  const handleExport = () => {
    if (!analysis) return;

    const csvContent = analysis.clusters.map(result => ({
      ...result.data,
      cluster: result.cluster,
      clusterName: analysis.clusterSummaries[result.cluster]?.name || `Cluster ${result.cluster}`
    }));

    const csv = [
      Object.keys(csvContent[0]).join(','),
      ...csvContent.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_clusters.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing clustering analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ecommerce Customer Segmentation Dashboard</h1>
              <p className="text-gray-600">{data.length} customers • {clusterCount} clusters identified</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Results</span>
              </button>
              <button
                onClick={onReset}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Clusters
              </label>
              <select
                value={clusterCount}
                onChange={(e) => setClusterCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: Math.min(8, data.length - 1) }, (_, i) => i + 2).map(k => (
                  <option key={k} value={k}>
                    {k} clusters {k === optimalAnalysis.k ? '(Optimal)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X-Axis Feature
              </label>
              <select
                value={xFeature}
                onChange={(e) => setXFeature(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {numericFeatures.map(feature => (
                  <option key={feature} value={feature}>
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y-Axis Feature
              </label>
              <select
                value={yFeature}
                onChange={(e) => setYFeature(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {numericFeatures.map(feature => (
                  <option key={feature} value={feature}>
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Cluster
              </label>
              <select
                value={selectedCluster ?? ''}
                onChange={(e) => setSelectedCluster(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Clusters</option>
                {analysis.clusterSummaries.map(summary => (
                  <option key={summary.clusterId} value={summary.clusterId}>
                    {summary.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Silhouette Score</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.silhouetteScore.toFixed(3)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Higher scores indicate better clustering quality
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {selectedCluster !== null ? `Filtered to cluster ${selectedCluster}` : 'All customers included'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clusters</p>
                <p className="text-2xl font-bold text-gray-900">{clusterCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Optimal: {optimalAnalysis.k} clusters
            </p>
          </div>
        </div>

        {/* Visualization */}
        {xFeature && yFeature && (
          <div className="mb-8">
            <ClusterVisualization 
              analysis={analysis} 
              xFeature={xFeature} 
              yFeature={yFeature} 
            />
          </div>
        )}

        {/* Cluster Summaries */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Customer Personas</h2>
            <p className="text-gray-600">Detailed analysis of each customer segment</p>
          </div>
          <ClusterSummary summaries={analysis.clusterSummaries} />
        </div>
      </div>
    </div>
  );
}