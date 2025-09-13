import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, MessageSquare } from "lucide-react";

interface SentimentAnalysisProps {
  comments: string[];
}

interface SentimentResult {
  comment: string;
  sentiment: 'agreement' | 'removal' | 'modification';
  confidence: number;
}

export const SentimentAnalysis = ({ comments }: SentimentAnalysisProps) => {
  // Mock sentiment analysis - in a real app, this would call an AI API
  const sentimentResults = useMemo<SentimentResult[]>(() => {
    return comments.map((comment) => {
      // Simple keyword-based sentiment analysis for demo
      const positiveWords = ['support', 'excellent', 'good', 'positive', 'appreciate', 'well', 'strengthen', 'improve', 'comprehensive'];
      const negativeWords = ['concern', 'poor', 'harm', 'restrict', 'serious', 'drive away', 'burden', 'against'];
      
      const lowerComment = comment.toLowerCase();
      const positiveMatches = positiveWords.filter(word => lowerComment.includes(word)).length;
      const negativeMatches = negativeWords.filter(word => lowerComment.includes(word)).length;
      
      let sentiment: 'agreement' | 'removal' | 'modification';
      let confidence: number;
      
      if (positiveMatches > negativeMatches) {
        sentiment = 'agreement';
        confidence = Math.min(0.95, 0.6 + (positiveMatches * 0.1));
      } else if (negativeMatches > positiveMatches) {
        sentiment = 'removal';
        confidence = Math.min(0.95, 0.6 + (negativeMatches * 0.1));
      } else {
        sentiment = 'modification';
        confidence = 0.7 + Math.random() * 0.2;
      }
      
      return { comment, sentiment, confidence };
    });
  }, [comments]);

  const sentimentCounts = useMemo(() => {
    const counts = sentimentResults.reduce(
      (acc, result) => {
        acc[result.sentiment]++;
        return acc;
      },
      { agreement: 0, removal: 0, modification: 0 }
    );
    
    const total = sentimentResults.length;
    return {
      agreement: { count: counts.agreement, percentage: (counts.agreement / total) * 100 },
      removal: { count: counts.removal, percentage: (counts.removal / total) * 100 },
      modification: { count: counts.modification, percentage: (counts.modification / total) * 100 },
    };
  }, [sentimentResults]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'agreement':
        return <TrendingUp className="h-4 w-4" />;
      case 'removal':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'agreement':
        return 'default';
      case 'removal':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (comments.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium text-muted-foreground">
              No comments to analyze
            </p>
            <p className="text-sm text-muted-foreground">
              Upload a file with stakeholder comments to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Sentiment Summary */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Overall Sentiment Analysis</CardTitle>
          <CardDescription>
            Analyzing {comments.length} stakeholder comments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* In Agreement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">In Agreement</span>
                </div>
                <span className="text-sm font-medium">
                  {sentimentCounts.agreement.count} ({sentimentCounts.agreement.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={sentimentCounts.agreement.percentage} className="h-2" />
            </div>

            {/* In Modification */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">In Modification of Section</span>
                </div>
                <span className="text-sm font-medium">
                  {sentimentCounts.modification.count} ({sentimentCounts.modification.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={sentimentCounts.modification.percentage} className="h-2" />
            </div>

            {/* In Removal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-medium">In Removal of Section</span>
                </div>
                <span className="text-sm font-medium">
                  {sentimentCounts.removal.count} ({sentimentCounts.removal.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={sentimentCounts.removal.percentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Comments Analysis */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Individual Comment Analysis</CardTitle>
          <CardDescription>
            Detailed sentiment analysis for each stakeholder comment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentResults.map((result, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-gradient-card hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-foreground leading-relaxed">
                      {result.comment}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getSentimentBadgeVariant(result.sentiment)}
                        className="flex items-center space-x-1"
                      >
                        {getSentimentIcon(result.sentiment)}
                        <span className="capitalize">{result.sentiment}</span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};