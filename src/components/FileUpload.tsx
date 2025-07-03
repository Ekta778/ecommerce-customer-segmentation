import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { CustomerRecord } from '../types';

interface FileUploadProps {
  onDataLoad: (data: CustomerRecord[]) => void;
}

export function FileUpload({ onDataLoad }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    console.log('Processing file:', file.name, file.size, file.type);
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        console.log('Original header:', header);
        return header.trim().toLowerCase().replace(/\s+/g, '_');
      },
      transform: (value, header) => {
        // Try to convert numeric strings to numbers
        const trimmedValue = value.trim();
        if (trimmedValue === '') return null;
        
        // Check if it's a number
        const numValue = Number(trimmedValue);
        if (!isNaN(numValue) && isFinite(numValue)) {
          return numValue;
        }
        
        return trimmedValue;
      },
      complete: (results) => {
        console.log('Parse results:', results);
        setIsLoading(false);
        
        if (results.errors.length > 0) {
          console.error('Parse errors:', results.errors);
          setError('Error parsing CSV: ' + results.errors[0].message);
          return;
        }

        const rawData = results.data as any[];
        console.log('Raw data:', rawData);
        
        if (!rawData || rawData.length === 0) {
          setError('CSV file is empty or could not be parsed');
          return;
        }

        // Filter out empty rows
        const validData = rawData.filter(row => {
          return Object.values(row).some(value => value !== null && value !== '');
        });

        console.log('Valid data after filtering:', validData);

        if (validData.length < 2) {
          setError('CSV must contain at least 2 valid records for clustering');
          return;
        }

        // Add ID if not present and ensure all records have consistent structure
        const processedData: CustomerRecord[] = validData.map((record, index) => {
          const processedRecord: CustomerRecord = {
            id: record.id || record.customer_id || record.customerId || `customer_${index + 1}`,
          };

          // Add all other fields
          Object.keys(record).forEach(key => {
            if (key !== 'id' && record[key] !== null && record[key] !== '') {
              processedRecord[key] = record[key];
            }
          });

          return processedRecord;
        });

        console.log('Processed data:', processedData);

        // Check for numeric columns
        const sampleRecord = processedData[0];
        const numericColumns = Object.keys(sampleRecord).filter(key => 
          key !== 'id' && typeof sampleRecord[key] === 'number'
        );

        console.log('Numeric columns found:', numericColumns);

        if (numericColumns.length < 2) {
          setError(`CSV must contain at least 2 numeric columns for clustering analysis. Found: ${numericColumns.join(', ')}`);
          return;
        }

        setSuccess(`Successfully loaded ${processedData.length} records with ${numericColumns.length} numeric features`);
        
        // Call onDataLoad after a short delay to show success message
        setTimeout(() => {
          onDataLoad(processedData);
        }, 1000);
      },
      error: (error) => {
        console.error('Papa parse error:', error);
        setIsLoading(false);
        setError('Failed to parse CSV: ' + error.message);
      }
    });
  }, [onDataLoad]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files selected:', files);
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
            : success 
            ? 'border-green-500 bg-green-50'
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
          disabled={isLoading || !!success}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {success ? 'File Uploaded Successfully!' : 'Upload Customer Data'}
            </h3>
            <p className="text-gray-600 mb-4">
              {success 
                ? 'Processing your data for clustering analysis...'
                : 'Drag and drop your CSV file here, or click to select'
              }
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

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Success</span>
          </div>
          <p className="mt-1 text-sm text-green-600">{success}</p>
        </div>
      )}
    </div>
  );
}