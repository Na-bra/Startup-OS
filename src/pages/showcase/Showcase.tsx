import { Rocket, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebadge';
import { mockStartups, mockUsers } from '@/data/mock-data';

export default function Showcase() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Startup Showcase</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Discover innovative startups from our collaborative lab. These teams are building the future.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockStartups.map(startup => {
          const founder = mockUsers.find(u => u.id === startup.created_by);
          return (
            <Card key={startup.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{startup.name}</h3>
                    <StageBadge stage={startup.stage} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{startup.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Founded by {founder?.full_name}</span>
                  <span>{new Date(startup.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
