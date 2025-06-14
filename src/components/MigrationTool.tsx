
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { runFullMigration, migrateResourceData, migrateProductData } from '@/services/dataMigration';
import { toast } from 'sonner';
import { Database, Upload, Package, Users } from 'lucide-react';

export const MigrationTool = () => {
  const [isRunning, setIsRunning] = useState(false);

  const handleFullMigration = async () => {
    setIsRunning(true);
    try {
      await runFullMigration();
      toast.success('Full migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Migration failed. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResourceMigration = async () => {
    setIsRunning(true);
    try {
      await migrateResourceData();
      toast.success('Resource data migrated successfully!');
    } catch (error) {
      console.error('Resource migration failed:', error);
      toast.error('Resource migration failed. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleProductMigration = async () => {
    setIsRunning(true);
    try {
      await migrateProductData();
      toast.success('Product data migrated successfully!');
    } catch (error) {
      console.error('Product migration failed:', error);
      toast.error('Product migration failed. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Migration Tool
          </CardTitle>
          <CardDescription>
            Migrate existing mock data to Supabase database. This tool will transfer resources, products, and community data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleResourceMigration}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
            >
              <Upload className="h-6 w-6" />
              <span>Migrate Resources</span>
            </Button>
            
            <Button
              onClick={handleProductMigration}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
            >
              <Package className="h-6 w-6" />
              <span>Migrate Products</span>
            </Button>
            
            <Button
              disabled={true}
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col opacity-50"
            >
              <Users className="h-6 w-6" />
              <span>Migrate Community</span>
              <small>(Requires Auth)</small>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <Button
              onClick={handleFullMigration}
              disabled={isRunning}
              className="w-full h-12"
              size="lg"
            >
              {isRunning ? 'Migrating...' : 'Run Full Migration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
