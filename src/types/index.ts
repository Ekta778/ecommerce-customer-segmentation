export interface CustomerRecord {
  id: string;
  [key: string]: string | number;
}

export interface ClusterResult {
  cluster: number;
  data: CustomerRecord;
  centroid: number[];
}

export interface ClusterAnalysis {
  clusters: ClusterResult[];
  centroids: number[][];
  silhouetteScore: number;
  clusterSummaries: ClusterSummary[];
}

export interface ClusterSummary {
  clusterId: number;
  count: number;
  characteristics: { [key: string]: number | string };
  color: string;
  name: string;
}