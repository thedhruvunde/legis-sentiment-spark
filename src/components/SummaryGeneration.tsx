import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface SummaryGenerationProps {
  comments: string[];
}

export const SummaryGeneration = ({ comments }: SummaryGenerationProps) => {
  const summary = useMemo(() => {
    if (comments.length === 0) return null;

    // Analyze sentiment distribution
    const positiveKeywords = ['support', 'excellent', 'good', 'positive', 'appreciate', 'well', 'strengthen', 'improve', 'comprehensive', 'initiative'];
    const negativeKeywords = ['concern', 'poor', 'harm', 'restrict', 'serious', 'drive away', 'burden', 'against', 'oppose', 'problematic'];
    const neutralKeywords = ['suggest', 'recommend', 'consider', 'clarify', 'modify', 'reasonable', 'adequate'];

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    
    const keyThemes = new Set<string>();
    const concerns = new Set<string>();
    const suggestions = new Set<string>();

    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      
      // Count sentiment
      const hasPositive = positiveKeywords.some(word => lowerComment.includes(word));
      const hasNegative = negativeKeywords.some(word => lowerComment.includes(word));
      const hasNeutral = neutralKeywords.some(word => lowerComment.includes(word));
      
      if (hasPositive && !hasNegative) positiveCount++;
      else if (hasNegative && !hasPositive) negativeCount++;
      else neutralCount++;

      // Extract themes
      if (lowerComment.includes('transparency') || lowerComment.includes('accountability')) {
        keyThemes.add('Corporate Transparency & Accountability');
      }
      if (lowerComment.includes('compliance') || lowerComment.includes('regulation')) {
        keyThemes.add('Regulatory Compliance');
      }
      if (lowerComment.includes('small business') || lowerComment.includes('startup')) {
        keyThemes.add('Impact on Small Businesses');
      }
      if (lowerComment.includes('implementation') || lowerComment.includes('timeline')) {
        keyThemes.add('Implementation Concerns');
      }
      if (lowerComment.includes('privacy') || lowerComment.includes('data')) {
        keyThemes.add('Data Privacy & Security');
      }
      if (lowerComment.includes('governance') || lowerComment.includes('oversight')) {
        keyThemes.add('Corporate Governance');
      }

      // Extract specific concerns
      if (lowerComment.includes('burden') || lowerComment.includes('cost')) {
        concerns.add('Increased compliance burden and costs');
      }
      if (lowerComment.includes('privacy') || lowerComment.includes('confidential')) {
        concerns.add('Privacy and confidentiality implications');
      }
      if (lowerComment.includes('small') || lowerComment.includes('startup')) {
        concerns.add('Disproportionate impact on small businesses');
      }
      if (lowerComment.includes('unclear') || lowerComment.includes('confusing')) {
        concerns.add('Lack of clarity in implementation guidelines');
      }

      // Extract suggestions
      if (lowerComment.includes('phased') || lowerComment.includes('gradual')) {
        suggestions.add('Implement changes in phases');
      }
      if (lowerComment.includes('clarify') || lowerComment.includes('clearer')) {
        suggestions.add('Provide clearer implementation guidelines');
      }
      if (lowerComment.includes('exemption') || lowerComment.includes('exception')) {
        suggestions.add('Consider exemptions for specific business categories');
      }
      if (lowerComment.includes('consultation') || lowerComment.includes('stakeholder')) {
        suggestions.add('Conduct additional stakeholder consultations');
      }
    });

    const overallSentiment = 
      positiveCount > negativeCount && positiveCount > neutralCount ? 'positive' :
      negativeCount > positiveCount && negativeCount > neutralCount ? 'negative' : 'mixed';

    return {
      totalComments: comments.length,
      sentimentDistribution: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount
      },
      overallSentiment,
      keyThemes: Array.from(keyThemes),
      mainConcerns: Array.from(concerns),
      suggestions: Array.from(suggestions)
    };
  }, [comments]);

  if (!summary) {
    return (
      <Card className="shadow-medium">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium text-muted-foreground">
              No summary available
            </p>
            <p className="text-sm text-muted-foreground">
              Upload stakeholder comments to generate AI-powered insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <Badge className="bg-positive text-positive-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Positive
          </Badge>
        );
      case 'negative':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Negative
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Mixed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Executive Summary</span>
          </CardTitle>
          <CardDescription>
            AI-generated insights from stakeholder feedback analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Total Comments Analyzed:</span>
              </div>
              <span className="text-lg font-bold text-primary">{summary.totalComments}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Sentiment:</span>
              {getSentimentBadge(summary.overallSentiment)}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Sentiment Breakdown:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 rounded-lg bg-positive/10 border border-positive/20">
                  <div className="font-semibold text-positive">{summary.sentimentDistribution.positive}</div>
                  <div className="text-muted-foreground">Positive</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-neutral/10 border border-neutral/20">
                  <div className="font-semibold text-neutral-foreground">{summary.sentimentDistribution.neutral}</div>
                  <div className="text-muted-foreground">Neutral</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-negative/10 border border-negative/20">
                  <div className="font-semibold text-negative">{summary.sentimentDistribution.negative}</div>
                  <div className="text-muted-foreground">Negative</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Themes */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Key Themes Identified</CardTitle>
          <CardDescription>
            Primary topics discussed across stakeholder comments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {summary.keyThemes.length > 0 ? (
              summary.keyThemes.map((theme, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {theme}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No specific themes identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Concerns */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Main Concerns Raised</span>
          </CardTitle>
          <CardDescription>
            Key concerns expressed by stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.mainConcerns.length > 0 ? (
              summary.mainConcerns.map((concern, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{concern}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No specific concerns identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-positive" />
            <span>Recommendations</span>
          </CardTitle>
          <CardDescription>
            Actionable suggestions from stakeholder feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.suggestions.length > 0 ? (
              summary.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-positive/5 border border-positive/20">
                  <CheckCircle2 className="h-4 w-4 text-positive mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No specific suggestions identified</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};