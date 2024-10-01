'use client';

import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PDFUploaderProps {
  onExtractedText: (text: string) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onExtractedText }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setExtractedText('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
      setExtractedText('');
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        const response = await fetch('/api/extract', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to extract text from the PDF.');
        }

        const data = await response.json();
        setExtractedText(data.text);
        onExtractedText(data.text); // Pass the extracted text to the parent component
      } catch (error) {
        setError('Failed to extract text from the PDF.');
        console.error('Error extracting text:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please select a PDF file before uploading.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="pdf-upload"
      />
      <label htmlFor="pdf-upload">
        <Button asChild>
          <span className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Select PDF
          </span>
        </Button>
      </label>
      {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
      <Button onClick={handleUpload} disabled={!file || isLoading}>
        {isLoading ? 'Extracting...' : 'Extract Text'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    
    </div>
  );
};

export default PDFUploader;