import { kmeans } from 'ml-kmeans';
import { CustomerRecord, ClusterResult, ClusterAnalysis, ClusterSummary } from '../types';

export const CLUSTER_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
];

export const CLUSTER_NAMES = [
  'High-Value Customers',
  'Budget-Conscious',
  'Frequent Buyers',
  'Occasional Shoppers',
  'Premium Seekers',
  'Deal Hunters',
  'Loyal Customers',
  'New Customers',
];

// Simple euclidean distance function
function euclidean(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

export function normalizeData(data: CustomerRecord[], excludeColumns: string[] = ['id']): { normalized: number[][], features: string[] } {
  const features = Object.keys(data[0]).filter(key => 
    !excludeColumns.includes(key) && 
    typeof data[0][key] === 'number'
  );

  const values = data.map(record => 
    features.map(feature => Number(record[feature]) || 0)
  );

  // Min-max normalization
  const mins = features.map((_, i) => Math.min(...values.map(row => row[i])));
  const maxs = features.map((_, i) => Math.max(...values.map(row => row[i])));
  
  const normalized = values.map(row =>
    row.map((val, i) => {
      const range = maxs[i] - mins[i];
      return range === 0 ? 0 : (val - mins[i]) / range;
    })
  );

  return { normalized, features };
}

export function calculateSilhouetteScore(data: number[][], clusters: number[]): number {
  const n = data.length;
  let totalScore = 0;

  for (let i = 0; i < n; i++) {
    const currentCluster = clusters[i];
    
    // Calculate a(i) - average distance to points in same cluster
    const sameClusterPoints = data.filter((_, idx) => clusters[idx] === currentCluster && idx !== i);
    const aI = sameClusterPoints.length > 0 
      ? sameClusterPoints.reduce((sum, point) => sum + euclidean(data[i], point), 0) / sameClusterPoints.length
      : 0;

    // Calculate b(i) - minimum average distance to points in other clusters
    const otherClusters = [...new Set(clusters)].filter(c => c !== currentCluster);
    let bI = Infinity;
    
    for (const cluster of otherClusters) {
      const otherClusterPoints = data.filter((_, idx) => clusters[idx] === cluster);
      if (otherClusterPoints.length > 0) {
        const avgDistance = otherClusterPoints.reduce((sum, point) => sum + euclidean(data[i], point), 0) / otherClusterPoints.length;
        bI = Math.min(bI, avgDistance);
      }
    }

    // Silhouette coefficient for point i
    const silhouette = bI === Infinity ? 0 : (bI - aI) / Math.max(aI, bI);
    totalScore += silhouette;
  }

  return totalScore / n;
}

export function performClustering(data: CustomerRecord[], k: number): ClusterAnalysis {
  const { normalized, features } = normalizeData(data);
  
  if (normalized.length < k) {
    throw new Error(`Not enough data points for ${k} clusters. Need at least ${k} records.`);
  }

  const result = kmeans(normalized, k, { maxIterations: 100 });
  
  const clusterResults: ClusterResult[] = data.map((record, index) => ({
    cluster: result.clusters[index],
    data: record,
    centroid: result.centroids[result.clusters[index]]
  }));

  const silhouetteScore = calculateSilhouetteScore(normalized, result.clusters);

  // Generate cluster summaries
  const clusterSummaries: ClusterSummary[] = [];
  for (let i = 0; i < k; i++) {
    const clusterData = clusterResults.filter(r => r.cluster === i);
    const characteristics: { [key: string]: number | string } = {};
    
    // Calculate average values for each feature
    features.forEach(feature => {
      const values = clusterData.map(r => Number(r.data[feature]) || 0);
      characteristics[feature] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });
    
    clusterSummaries.push({
      clusterId: i,
      count: clusterData.length,
      characteristics,
      color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
      name: CLUSTER_NAMES[i % CLUSTER_NAMES.length]
    });
  }

  return {
    clusters: clusterResults,
    centroids: result.centroids,
    silhouetteScore,
    clusterSummaries
  };
}

export function findOptimalClusters(data: CustomerRecord[], maxK: number = 8): { k: number; scores: { k: number; score: number }[] } {
  const scores: { k: number; score: number }[] = [];
  
  for (let k = 2; k <= Math.min(maxK, data.length); k++) {
    try {
      const analysis = performClustering(data, k);
      scores.push({ k, score: analysis.silhouetteScore });
    } catch (error) {
      break;
    }
  }

  // Handle case where no scores were generated
  if (scores.length === 0) {
    return { k: 2, scores: [] };
  }

  const optimal = scores.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return { k: optimal.k, scores };
}