import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { CustomerRecord } from '../types';

interface FileUploadProps {
  onDataLoad: (data: CustomerRecord[]) => void;
}

export function FileUpload({ onDataLoad }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, header) => {
        // Try to convert numeric strings to numbers
        const trimmedValue = value.trim();
        if (trimmedValue === '') return '';
        
        // Check if it's a number
        const numValue = Number(trimmedValue);
        if (!isNaN(numValue) && isFinite(numValue)) {
          return numValue;
        }
        
        return trimmedValue;
      },
      complete: (results) => {
        setIsLoading(false);
        
        if (results.errors.length > 0) {
          setError('Error parsing CSV: ' + results.errors[0].message);
          return;
        }

        const data = results.data as CustomerRecord[];
        
        // Add ID if not present
        const processedData = data.map((record, index) => ({
          id: record.id || `customer_${index + 1}`,
          ...record
        }));

        // Validate data
        if (processedData.length < 2) {
          setError('CSV must contain at least 2 records for clustering');
          return;
        }

        // Check for numeric columns
        const numericColumns = Object.keys(processedData[0]).filter(key => 
          key !== 'id' && typeof processedData[0][key] === 'number'
        );

        if (numericColumns.length < 2) {
          setError('CSV must contain at least 2 numeric columns for clustering analysis');
          return;
        }

        onDataLoad(processedData);
      },
      error: (error) => {
        setIsLoading(false);
        setError('Failed to parse CSV: ' + error.message);
      }
    });
  }, [onDataLoad]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Customer Data
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your CSV file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              CSV should contain customer records with numeric columns for clustering analysis
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>Supports CSV files only</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Upload Error</span>
          </div>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}