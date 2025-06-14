import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { runFullMigration, migrateResourceData, migrateProductData } from '@/services/migration/migrators';
import { toast } from 'sonner';
import { Database, Upload, Package, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface MigrationStatus {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  completed: boolean;
  error?: string;
}

export const MigrationTool = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    isRunning: false,
    progress: 0,
    currentStep: '',
    completed: false
  });

  const updateStatus = (progress: number, step: string) => {
    setMigrationStatus(prev => ({
      ...prev,
      progress,
      currentStep: step
    }));
  };

  const handleFullMigration = async () => {
    setMigrationStatus({
      isRunning: true,
      progress: 0,
      currentStep: 'Starting migration...',
      completed: false
    });

    try {
      updateStatus(10, 'Preparing migration...');
      await new Promise(resolve => setTimeout(resolve, 500));

      updateStatus(30, 'Migrating resources (16 items)...');
      await migrateResourceData();
      
      updateStatus(70, 'Migrating products (6 items)...');
      await migrateProductData();
      
      updateStatus(90, 'Finalizing migration...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMigrationStatus({
        isRunning: false,
        progress: 100,
        currentStep: 'Migration completed successfully!',
        completed: true
      });

      toast.success('Full migration completed successfully! All 22 items migrated.');
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus({
        isRunning: false,
        progress: 0,
        currentStep: 'Migration failed',
        completed: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      toast.error('Migration failed. Check console for details.');
    }
  };

  const handleResourceMigration = async () => {
    setMigrationStatus({
      isRunning: true,
      progress: 0,
      currentStep: 'Migrating resources...',
      completed: false
    });

    try {
      updateStatus(50, 'Transferring 16 AI learning resources...');
      await migrateResourceData();
      
      setMigrationStatus({
        isRunning: false,
        progress: 100,
        currentStep: 'Resources migrated successfully!',
        completed: true
      });

      toast.success('Resource data migrated successfully! 16 resources transferred.');
    } catch (error) {
      console.error('Resource migration failed:', error);
      setMigrationStatus({
        isRunning: false,
        progress: 0,
        currentStep: 'Resource migration failed',
        completed: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      toast.error('Resource migration failed. Check console for details.');
    }
  };

  const handleProductMigration = async () => {
    setMigrationStatus({
      isRunning: true,
      progress: 0,
      currentStep: 'Migrating products...',
      completed: false
    });

    try {
      updateStatus(50, 'Transferring 6 product catalog items...');
      await migrateProductData();
      
      setMigrationStatus({
        isRunning: false,
        progress: 100,
        currentStep: 'Products migrated successfully!',
        completed: true
      });

      toast.success('Product data migrated successfully! 6 products transferred.');
    } catch (error) {
      console.error('Product migration failed:', error);
      setMigrationStatus({
        isRunning: false,
        progress: 0,
        currentStep: 'Product migration failed',
        completed: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      toast.error('Product migration failed. Check console for details.');
    }
  };

  const resetMigration = () => {
    setMigrationStatus({
      isRunning: false,
      progress: 0,
      currentStep: '',
      completed: false
    });
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
            Transfer mock data to Supabase database: 16 AI learning resources and 6 e-commerce products.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Migration Status */}
          {(migrationStatus.isRunning || migrationStatus.completed || migrationStatus.error) && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Migration Status</span>
                {migrationStatus.completed && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {migrationStatus.error && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              
              <Progress value={migrationStatus.progress} className="w-full" />
              
              <div className="text-sm text-gray-600">
                {migrationStatus.currentStep}
              </div>
              
              {migrationStatus.error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Error: {migrationStatus.error}
                </div>
              )}
              
              {(migrationStatus.completed || migrationStatus.error) && (
                <Button onClick={resetMigration} variant="outline" size="sm">
                  Reset Status
                </Button>
              )}
            </div>
          )}

          {/* Individual Migration Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleResourceMigration}
              disabled={migrationStatus.isRunning}
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
            >
              <Upload className="h-6 w-6" />
              <span>Migrate Resources</span>
              <small className="text-xs text-gray-500">16 items</small>
            </Button>
            
            <Button
              onClick={handleProductMigration}
              disabled={migrationStatus.isRunning}
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col"
            >
              <Package className="h-6 w-6" />
              <span>Migrate Products</span>
              <small className="text-xs text-gray-500">6 items</small>
            </Button>
            
            <Button
              disabled={true}
              variant="outline"
              className="flex items-center gap-2 h-20 flex-col opacity-50"
            >
              <Users className="h-6 w-6" />
              <span>Migrate Community</span>
              <small className="text-xs text-gray-500">(Requires Auth)</small>
            </Button>
          </div>
          
          {/* Full Migration Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={handleFullMigration}
              disabled={migrationStatus.isRunning}
              className="w-full h-12"
              size="lg"
            >
              {migrationStatus.isRunning ? 'Migrating...' : 'Run Full Migration (22 items)'}
            </Button>
          </div>

          {/* Migration Instructions */}
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Migration Plan:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Migrate Resources" to transfer 16 AI learning resources</li>
              <li>Click "Migrate Products" to transfer 6 e-commerce products</li>
              <li>Or use "Run Full Migration" to transfer all data at once</li>
              <li>Visit the resource directory and shopping pages to verify data</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
