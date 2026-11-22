import { useState } from 'react';
import { AlertCircle, CheckCircle2, FileUp, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createImportedResourceDraft } from '@/services/backend/admin';
import { analyzeResourceImport, importReadyDrafts, parseResourceImportFile, retryFailedDrafts, type ImportAnalysis } from '@/services/resourceImportService';

interface BulkResourceImportProps {
  existingResources: Array<Record<string, unknown>>;
  onImported: () => void;
}

const statusLabel: Record<string, string> = {
  ready: 'Ready',
  already_imported: 'Already imported',
  duplicate_review: 'Duplicate: review',
  invalid: 'Invalid',
  failed: 'Failed',
  imported: 'Imported as draft',
};

export const BulkResourceImport = ({ existingResources, onImported }: BulkResourceImportProps) => {
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [reviewedDuplicates, setReviewedDuplicates] = useState<Set<string>>(new Set());

  const handleFile = async (file?: File) => {
    setError('');
    setAnalysis(null);
    setReviewedDuplicates(new Set());
    if (!file) return;
    setFileName(file.name);
    try {
      const parsed = parseResourceImportFile(await file.text(), file.name);
      setAnalysis(analyzeResourceImport(parsed, existingResources));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The selected file could not be read.');
    }
  };

  const runImport = async () => {
    if (!analysis) return;
    setIsImporting(true);
    try {
      const records = analysis.records.map((record, index) => (
        record.status === 'duplicate_review' && reviewedDuplicates.has(`${record.sourceId}:${index}`)
          ? { ...record, status: 'ready' as const, warnings: [...record.warnings, 'Marked for separate draft import after duplicate review.'] }
          : { ...record }
      ));
      const counts = await importReadyDrafts(records, createImportedResourceDraft);
      setAnalysis({ ...analysis, records, counts });
      onImported();
    } finally {
      setIsImporting(false);
    }
  };

  const retryFailed = async () => {
    if (!analysis) return;
    setIsImporting(true);
    try {
      const counts = await retryFailedDrafts(analysis.records, createImportedResourceDraft);
      setAnalysis({ ...analysis, records: analysis.records, counts });
      onImported();
    } finally {
      setIsImporting(false);
    }
  };

  const reviewedDuplicateCount = analysis?.records.filter((record, index) => record.status === 'duplicate_review' && reviewedDuplicates.has(`${record.sourceId}:${index}`)).length ?? 0;
  const importableCount = (analysis?.counts.ready ?? 0) + reviewedDuplicateCount;
  const visibleRecords = analysis?.records ?? [];

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileUp className="h-5 w-5" />Bulk Import Resources</CardTitle>
          <CardDescription>Upload one JSON or CSV inventory. Records are previewed and imported as unpublished drafts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-medium" htmlFor="resource-import-file">Upload JSON or CSV</label>
          <input
            id="resource-import-file"
            type="file"
            accept=".json,.csv,application/json,text/csv"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <p className="text-xs text-muted-foreground">If your JSON and CSV contain the same inventory, upload only one file. Original source fields are retained for traceability.</p>
          {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
          {error && <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Import Preview</CardTitle>
              <CardDescription>{analysis.records.length} records found. Existing records will never be overwritten.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Object.entries(analysis.counts).map(([status, count]) => (
                  <div key={status} className="rounded-md border p-3">
                    <div className="text-xl font-semibold">{count}</div>
                    <div className="text-xs text-muted-foreground">{statusLabel[status]}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1"><LinkIcon className="h-3 w-3" />{analysis.missingUrls} missing URLs</Badge>
                <Badge variant="outline" className="gap-1"><ImageIcon className="h-3 w-3" />{analysis.missingImages} missing images</Badge>
              </div>
              {importableCount > 0 && (
                <Button onClick={() => void runImport()} disabled={isImporting}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isImporting ? 'Importing drafts…' : `Import ${importableCount} as Draft${importableCount === 1 ? '' : 's'}`}
                </Button>
              )}
              {analysis.counts.failed > 0 && (
                <Button variant="outline" onClick={() => void retryFailed()} disabled={isImporting}>
                  {isImporting ? 'Retrying failed records…' : `Retry ${analysis.counts.failed} Failed Record${analysis.counts.failed === 1 ? '' : 's'}`}
                </Button>
              )}
              {analysis.counts.imported > 0 && <p className="text-sm font-medium text-green-700">{analysis.counts.imported} draft(s) saved. None were published.</p>}
              {analysis.counts.failed > 0 && <p role="alert" className="text-sm text-destructive">Some records failed to save. See the per-record report below and retry after resolving the issue.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Report</CardTitle>
              <CardDescription>Showing {visibleRecords.length} of {analysis.records.length} records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleRecords.map((record, index) => (
                <div key={`${record.sourceId}-${index}`} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{record.resource?.title || '(Untitled record)'}</div>
                    <Badge variant={record.status === 'invalid' || record.status === 'failed' || record.status === 'duplicate_review' ? 'destructive' : record.status === 'imported' ? 'default' : 'secondary'}>
                      {statusLabel[record.status]}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Source ID: {record.sourceId}{record.duplicateOf ? ` · Match: ${record.duplicateOf}` : ''}</div>
                  {[...record.errors, ...record.warnings].map((message, messageIndex) => (
                    <p key={messageIndex} className={`mt-1 text-xs ${record.errors.includes(message) ? 'text-destructive' : 'text-amber-700'}`}>{message}</p>
                  ))}
                  {record.status === 'duplicate_review' && (
                    <label className="mt-3 flex items-start gap-2 text-xs">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={reviewedDuplicates.has(`${record.sourceId}:${index}`)}
                        onChange={(event) => setReviewedDuplicates((current) => {
                          const next = new Set(current);
                          const key = `${record.sourceId}:${index}`;
                          if (event.target.checked) next.add(key);
                          else next.delete(key);
                          return next;
                        })}
                      />
                      I reviewed this match; keep this source entry as a separate draft.
                    </label>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
