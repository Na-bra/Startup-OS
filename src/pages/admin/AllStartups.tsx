import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { mockStartups, mockMilestones, mockMentorships, mockUsers } from '@/data/mock-data';

export default function AllStartups() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>All Startups</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all startups in the lab.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Founded</TableHead>
                <TableHead>Mentor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStartups.map(startup => {
                const sml = mockMilestones.filter(m => m.startup_id === startup.id);
                const done = sml.filter(m => m.status === 'completed').length;
                const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
                const mentorship = mockMentorships.find(m => m.startup_id === startup.id);
                const mentor = mentorship ? mockUsers.find(u => u.id === mentorship.mentor_id) : null;
                const founder = mockUsers.find(u => u.id === startup.created_by);
                return (
                  <TableRow key={startup.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{startup.name}</p>
                        <p className="text-xs text-muted-foreground">{founder?.full_name}</p>
                      </div>
                    </TableCell>
                    <TableCell><StageBadge stage={startup.stage} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(startup.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{mentor?.full_name ?? 'Unassigned'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
