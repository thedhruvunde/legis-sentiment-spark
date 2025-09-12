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
  sentiment: 'positive' | 'negative' | 'neutral';
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
      
      let sentiment: 'positive' | 'negative' | 'neutral';
      let confidence: number;
      
      if (positiveMatches > negativeMatches) {
        sentiment = 'positive';
        confidence = Math.min(0.95, 0.6 + (positiveMatches * 0.1));
      } else if (negativeMatches > positiveMatches) {
        sentiment = 'negative';
        confidence = Math.min(0.95, 0.6 + (negativeMatches * 0.1));
      } else {
        sentiment = 'neutral';
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
      { positive: 0, negative: 0, neutral: 0 }
    );
    
    const total = sentimentResults.length;
    return {
      positive: { count: counts.positive, percentage: (counts.positive / total) * 100 },
      negative: { count: counts.negative, percentage: (counts.negative / total) * 100 },
      neutral: { count: counts.neutral, percentage: (counts.neutral / total) * 100 },
    };
  }, [sentimentResults]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'default';
      case 'negative':
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
            {/* Positive */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-positive"></div>
                  <span className="font-medium">Positive</span>
                </div>
                <span className="text-sm font-medium">
                  {sentimentCounts.positive.count} ({sentimentCounts.positive.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={sentimentCounts.positive.percentage} className="h-2" />
            </div>

            {/* Neutral */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-neutral"></div>
                  <span className="font-medium">Neutral</span>
                </div>
                <span className="text-sm font-medium">
                  {sentimentCounts.neutral.count} ({sentimentCounts.neutral.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={sentimentCounts.neutral.percentage} className="h-2" />
            </div>

            {/* Negative */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-negative"></div>
                  <span className="font-medium">Negative</span>
                </div>
                <span className="text-sm font-medium">
                  {sentimentCounts.negative.count} ({sentimentCounts.negative.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={sentimentCounts.negative.percentage} className="h-2" />
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