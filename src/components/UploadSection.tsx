import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onCommentsUploaded: (comments: string[]) => void;
}

export const UploadSection = ({ onCommentsUploaded }: UploadSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const processFile = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const text = await file.text();
      
      // Simple CSV/text processing - split by lines and filter out empty ones
      const comments = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 100); // Limit to 100 comments for demo

      if (comments.length === 0) {
        throw new Error("No valid comments found in the file");
      }

      setUploadedFile(file.name);
      onCommentsUploaded(comments);
      
      toast({
        title: "File uploaded successfully",
        description: `Processed ${comments.length} comments for analysis`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Upload failed",
        description: "Please check your file format and try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onCommentsUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'text/csv' || file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv'))) {
      processFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or TXT file containing comments",
        variant: "destructive",
      });
    }
  }, [processFile, toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  // Sample data for demo
  const handleLoadSampleData = () => {
    const sampleComments = [
      "I strongly support this amendment as it will improve corporate transparency and accountability.",
      "This proposed legislation seems poorly thought out and may harm small businesses unnecessarily.",
      "The draft is comprehensive but needs clearer guidelines for implementation timelines.",
      "Excellent initiative! This will significantly reduce compliance burden on companies.",
      "I have serious concerns about the privacy implications of these new reporting requirements.",
      "The amendment is well-structured and addresses key issues in corporate governance.",
      "This legislation is too restrictive and will drive businesses away from India.",
      "I appreciate the consultation process and believe this will strengthen our regulatory framework.",
      "The proposed changes are reasonable but may require additional clarification on specific clauses.",
      "This is a positive step towards better corporate oversight and investor protection."
    ];
    
    setUploadedFile("Sample Dataset");
    onCommentsUploaded(sampleComments);
    
    toast({
      title: "Sample data loaded",
      description: `Loaded ${sampleComments.length} sample comments for analysis`,
    });
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Upload Consultation Comments</span>
        </CardTitle>
        <CardDescription>
          Upload a CSV or TXT file containing stakeholder comments for sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {uploadedFile ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully uploaded: {uploadedFile}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    Drop your comments file here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports CSV and TXT files with one comment per line
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <Button
                      variant="default"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Processing..." : "Choose File"}
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleLoadSampleData}
                    disabled={isUploading}
                  >
                    Load Sample Data
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>File Format:</strong> Upload CSV or TXT files with one comment per line. 
            The system will automatically process and analyze sentiment for each comment.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};