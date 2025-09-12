import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { UploadSection } from "@/components/UploadSection";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { WordCloud } from "@/components/WordCloud";
import { SummaryGeneration } from "@/components/SummaryGeneration";

const Index = () => {
  const [comments, setComments] = useState<string[]>([]);

  const handleCommentsUploaded = (uploadedComments: string[]) => {
    setComments(uploadedComments);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <UploadSection onCommentsUploaded={handleCommentsUploaded} />

          {/* Analysis Tabs */}
          <Tabs defaultValue="sentiment" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="summary">AI Summary</TabsTrigger>
              <TabsTrigger value="wordcloud">Word Cloud</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="sentiment" className="mt-0">
                <SentimentAnalysis comments={comments} />
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                <SummaryGeneration comments={comments} />
              </TabsContent>
              
              <TabsContent value="wordcloud" className="mt-0">
                <WordCloud comments={comments} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
