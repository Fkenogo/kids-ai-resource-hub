
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
        <CardDescription>
          Insights into resource performance and user engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
          <p className="text-muted-foreground">
            Detailed analytics and reporting features coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
