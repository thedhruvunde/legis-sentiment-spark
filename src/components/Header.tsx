import { Building2, FileText, TrendingUp } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  Ministry of Corporate Affairs
                </h1>
                <p className="text-sm text-muted-foreground">
                  E-Consultation Sentiment Analysis
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Government of India</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-primary font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};