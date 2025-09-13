import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Hash } from "lucide-react";

interface WordCloudProps {
  comments: string[];
}

interface WordFrequency {
  word: string;
  frequency: number;
  size: number;
}

export const WordCloud = ({ comments }: WordCloudProps) => {
  const wordFrequencies = useMemo<WordFrequency[]>(() => {
    if (comments.length === 0) return [];

    // Combine all comments and extract words
    const allText = comments.join(' ').toLowerCase();
    
    // Enhanced stop words including common filler words and domain-specific terms
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
      'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
      'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'as', 'if', 'than',
      'so', 'very', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how',
      'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
      'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
      'don', 'should', 've', 'll', 'd', 'm', 're', 'also', 'like', 'get', 'go', 'one',
      'two', 'first', 'last', 'new', 'old', 'good', 'bad', 'big', 'small', 'long', 'short',
      'high', 'low', 'right', 'left', 'next', 'previous', 'said', 'say', 'come', 'came',
      'give', 'take', 'make', 'know', 'think', 'see', 'look', 'want', 'use', 'find',
      'tell', 'ask', 'seem', 'feel', 'try', 'leave', 'call', 'back', 'way', 'even',
      'well', 'still', 'however', 'therefore', 'thus', 'hence', 'accordingly', 'consequently',
      // Common consultation/legal terms that might be too generic
      'provision', 'section', 'clause', 'draft', 'amendment', 'legislation', 'act', 'rule',
      'regulation', 'ministry', 'department', 'government', 'india', 'indian', 'public',
      'consultation', 'comment', 'suggestion', 'proposal', 'recommendation', 'request',
      'regarding', 'concerning', 'respect', 'matter', 'issue', 'subject', 'mentioned',
      'stated', 'provided', 'specified', 'considered', 'proposed', 'suggested', 'requested'
    ]);

    // Function to check if word is a year, date, or number
    const isNumericOrDate = (word: string): boolean => {
      // Check if it's a pure number
      if (/^\d+$/.test(word)) return true;
      
      // Check if it's a year (1900-2099)
      if (/^(19|20)\d{2}$/.test(word)) return true;
      
      // Check if it's a date-like pattern
      if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(word)) return true;
      
      // Check if it contains mostly numbers
      if (word.length > 2 && /\d/.test(word) && word.replace(/\d/g, '').length < 2) return true;
      
      return false;
    };

    // Function to check if word is meaningful
    const isMeaningfulWord = (word: string): boolean => {
      // Minimum length of 3 characters
      if (word.length < 3) return false;
      
      // Skip if it's in stop words
      if (stopWords.has(word)) return false;
      
      // Skip if it's numeric or date-related
      if (isNumericOrDate(word)) return false;
      
      // Skip if it's mostly punctuation or special characters
      if (!/^[a-zA-Z]+$/.test(word)) return false;
      
      // Skip very common suffixes/prefixes that got separated
      if (['ing', 'ion', 'tion', 'ness', 'ment', 'able', 'ible', 'ful', 'less'].includes(word)) return false;
      
      return true;
    };

    // Extract words and count frequencies
    const words = allText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(isMeaningfulWord);

    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by frequency
    const sortedWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50); // Top 50 words

    // Calculate relative sizes for visualization
    const maxFreq = sortedWords[0]?.[1] || 1;
    const minFreq = sortedWords[sortedWords.length - 1]?.[1] || 1;

    return sortedWords.map(([word, frequency]) => {
      // Scale font size between 12px and 36px
      const normalizedFreq = (frequency - minFreq) / (maxFreq - minFreq);
      const size = 12 + (normalizedFreq * 24);
      
      return {
        word,
        frequency,
        size: Math.round(size)
      };
    });
  }, [comments]);

  const getWordColor = (frequency: number, maxFreq: number) => {
    const intensity = frequency / maxFreq;
    if (intensity > 0.7) return 'text-primary';
    if (intensity > 0.4) return 'text-primary/80';
    if (intensity > 0.2) return 'text-primary/60';
    return 'text-muted-foreground';
  };

  if (comments.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Cloud className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-medium text-muted-foreground">
              No word cloud available
            </p>
            <p className="text-sm text-muted-foreground">
              Upload comments to generate word frequency analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxFreq = Math.max(...wordFrequencies.map(w => w.frequency));

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5 text-primary" />
          <span>Word Frequency Analysis</span>
        </CardTitle>
        <CardDescription>
          Most frequently used words across all stakeholder comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Word Cloud Visualization */}
          <div className="bg-gradient-subtle rounded-lg p-8 border">
            <div className="flex flex-wrap items-center justify-center gap-2 leading-relaxed">
              {wordFrequencies.slice(0, 30).map((wordData, index) => (
                <span
                  key={index}
                  className={`font-medium transition-colors hover:text-primary cursor-default ${getWordColor(
                    wordData.frequency,
                    maxFreq
                  )}`}
                  style={{ fontSize: `${wordData.size}px` }}
                  title={`"${wordData.word}" appears ${wordData.frequency} times`}
                >
                  {wordData.word}
                </span>
              ))}
            </div>
          </div>

          {/* Top Keywords Table */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center space-x-2">
              <Hash className="h-4 w-4" />
              <span>Top Keywords</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {wordFrequencies.slice(0, 12).map((wordData, index) => (
                <div
                  key={index}
                  className="bg-card border rounded-lg p-3 text-center hover:shadow-soft transition-all"
                >
                  <div className="font-medium text-foreground">{wordData.word}</div>
                  <div className="text-sm text-muted-foreground">
                    {wordData.frequency} mentions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};