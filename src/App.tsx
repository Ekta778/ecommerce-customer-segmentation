import React, { useState } from 'react';
import { BarChart3, Users } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { CustomerRecord } from './types';

function App() {
  const [data, setData] = useState<CustomerRecord[] | null>(null);

  const handleDataLoad = (customerData: CustomerRecord[]) => {
    setData(customerData);
  };

  const handleReset = () => {
    setData(null);
  };

  if (data) {
    return <Dashboard data={data} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-teal-600/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Ecommerce Customer Segmentation
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced K-Means clustering analysis to identify strategic customer personas 
              and unlock actionable insights for targeted marketing campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Segmentation</h3>
            <p className="text-gray-600">
              Automatically identify customer segments using advanced K-Means clustering with silhouette score validation.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Insights</h3>
            <p className="text-gray-600">
              Explore your data with dynamic visualizations, real-time filtering, and comprehensive persona analysis.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Actionable Results</h3>
            <p className="text-gray-600">
              Export clustered data and implement data-driven strategies to improve campaign performance by 20%+.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Get Started with Your Customer Data
          </h2>
          <p className="text-gray-600 mb-8">
            Upload your customer CSV file to begin advanced clustering analysis and persona identification.
          </p>
        </div>

        <FileUpload onDataLoad={handleDataLoad} />

        {/* Sample Data Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Expected CSV Format</h3>
            <p className="text-blue-800 mb-4">
              Your CSV should contain customer records with numeric columns for analysis. Example columns:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white px-3 py-2 rounded border border-blue-200">
                <span className="font-medium text-blue-900">customer_id</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-blue-200">
                <span className="font-medium text-blue-900">annual_spending</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-blue-200">
                <span className="font-medium text-blue-900">purchase_frequency</span>
              </div>
              <div className="bg-white px-3 py-2 rounded border border-blue-200">
                <span className="font-medium text-blue-900">avg_order_value</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;