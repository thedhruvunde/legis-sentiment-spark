import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, MessageSquare, PieChart, BarChart3 } from "lucide-react";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';

interface SentimentAnalysisProps {
  comments: string[];
}

interface SentimentResult {
  comment: string;
  sentiment: 'agreement' | 'removal' | 'modification';
  confidence: number;
  stakeholderType: string;
}

export const SentimentAnalysis = ({ comments }: SentimentAnalysisProps) => {
  // Mock sentiment analysis - in a real app, this would call an AI API
  const sentimentResults = useMemo<SentimentResult[]>(() => {
    const stakeholderTypes = ['Corporate Entity', 'Professional Body', 'Individual Practitioner', 'Industry Association', 'Government Agency', 'Academic Institution'];
    
    return comments.map((comment, index) => {
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
      
      return { 
        comment, 
        sentiment, 
        confidence,
        stakeholderType: stakeholderTypes[index % stakeholderTypes.length]
      };
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

  const pieChartData = useMemo(() => [
    { name: 'In Agreement', value: sentimentCounts.agreement.count, color: '#22c55e' },
    { name: 'In Modification', value: sentimentCounts.modification.count, color: '#3b82f6' },
    { name: 'In Removal', value: sentimentCounts.removal.count, color: '#ef4444' },
  ], [sentimentCounts]);

  const stakeholderData = useMemo(() => {
    const stakeholderGroups = sentimentResults.reduce((acc, result) => {
      if (!acc[result.stakeholderType]) {
        acc[result.stakeholderType] = { agreement: 0, modification: 0, removal: 0, total: 0 };
      }
      acc[result.stakeholderType][result.sentiment]++;
      acc[result.stakeholderType].total++;
      return acc;
    }, {} as Record<string, { agreement: number; modification: number; removal: number; total: number }>);

    return Object.entries(stakeholderGroups).map(([type, counts]) => ({
      stakeholderType: type.replace(' ', '\n'), // Line break for better display
      'In Agreement': counts.agreement,
      'In Modification': counts.modification,
      'In Removal': counts.removal,
      total: counts.total
    }));
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
      {/* Summary Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-medium">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">In Agreement</p>
              <p className="text-3xl font-bold text-green-600">
                {sentimentCounts.agreement.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {sentimentCounts.agreement.count} comments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">In Removal</p>
              <p className="text-3xl font-bold text-red-600">
                {sentimentCounts.removal.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {sentimentCounts.removal.count} comments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">In Modification</p>
              <p className="text-3xl font-bold text-blue-600">
                {sentimentCounts.modification.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {sentimentCounts.modification.count} comments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg. Sentiment</p>
              <p className="text-3xl font-bold text-primary">
                {((sentimentCounts.agreement.percentage - sentimentCounts.removal.percentage) / 100).toFixed(3)}
              </p>
              <p className="text-xs text-muted-foreground">
                Score
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Overall Sentiment Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stakeholder Type Distribution */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Sentiment by Stakeholder Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stakeholderData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stakeholderType" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="In Agreement" stackId="a" fill="#22c55e" />
                  <Bar dataKey="In Modification" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="In Removal" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

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