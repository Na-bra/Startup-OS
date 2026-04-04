import { FileText, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockDocuments, mockStartups } from '@/data/mock-data';

export default function Documents() {
  const myStartups = mockStartups.filter(s => s.created_by === '1');
  const myDocs = mockDocuments.filter(d => myStartups.some(s => s.id === d.startup_id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your startup documents and files.</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="grid gap-3">
        {myDocs.map(doc => {
          const startup = mockStartups.find(s => s.id === doc.startup_id);
          return (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{startup?.name} • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {myDocs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p>No documents uploaded yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
