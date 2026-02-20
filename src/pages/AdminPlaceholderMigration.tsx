
import React, { useState } from "react";
import { generatePlaceholderSvg } from "@/utils/generatePlaceholderSvg";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  getBrokenResourceImagesFromBackend,
  updateResourceImageUrlFromBackend,
} from "@/services/backend/resources";
import { uploadResourceImage } from "@/services/storageService";

/**
 * Admin page to batch assign placeholder images to resources with broken/legacy image urls.
 */
const AdminPlaceholderMigration = () => {
  const { isAuthenticated, hasAccess, isCheckingAccess } = useAdminAccess();
  const [resources, setResources] = useState<Array<{ id: string; title: string; image_url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<string[]>([]); // NEW

  // Fetch resources with broken /lovable-uploads/ image_url
  async function fetchResources() {
    setLoading(true);
    setDone(false);
    setErrors([]);
    setProgress("Finding broken images...");
    // Look for any resources with image_url LIKE '/lovable-uploads/%'
    try {
      const data = await getBrokenResourceImagesFromBackend();
      setResources(data || []);
      setLoading(false);
      setProgress(
        data && data.length > 0
          ? `${data.length} resources found with broken images.`
          : "No resources with broken images found."
      );
    } catch (error: unknown) {
      setProgress(error instanceof Error ? error.message : "Failed to fetch resources");
      setLoading(false);
    }
  }

  // Upload svg string as a file
  async function uploadSvgForResource(resource: { id: string; title: string }) {
    const svgDataUrl = generatePlaceholderSvg(resource.title);
    // Convert data URL to blob
    const res = await fetch(svgDataUrl);
    const blob = await res.blob();
    const fileName = `placeholder-${resource.id}.svg`;

    const file = new File([blob], fileName, { type: "image/svg+xml" });
    return uploadResourceImage(file);
  }

  // Assign placeholders to all in list
  async function assignPlaceholders() {
    setLoading(true);
    setDone(false);
    setErrors([]);
    let updated = 0;
    const errorList: string[] = [];
    for (let i = 0; i < resources.length; i++) {
      const res = resources[i];
      setProgress(`Processing (${i + 1}/${resources.length}): ${res.title}`);
      try {
        const url = await uploadSvgForResource(res);
        if (url) {
          // Update resource
          try {
            await updateResourceImageUrlFromBackend(res.id, url);
            updated++;
          } catch (updateError: unknown) {
            const message = updateError instanceof Error ? updateError.message : String(updateError);
            errorList.push(`Update failed for "${res.title}": ${message}`);
          }
        } else {
          errorList.push(`Upload SVG failed for "${res.title}"`);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        errorList.push(`Error uploading for "${res.title}": ${message}`);
      }
    }
    setProgress(`Done. Placeholders assigned to ${updated} resource${updated !== 1 ? "s" : ""}.`);
    setLoading(false);
    setDone(true);
    setErrors(errorList);
    // Refresh list
    fetchResources();
  }

  if (isCheckingAccess) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-8">
          <Card>
            <CardHeader>
              <CardTitle>Checking access</CardTitle>
              <CardDescription>Verifying admin permissions...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !hasAccess) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-8">
          <Card>
            <CardHeader>
              <CardTitle>Access denied</CardTitle>
              <CardDescription>You need an admin or moderator account to run this migration.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              {!isAuthenticated ? (
                <Button asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              ) : null}
              <Button variant="outline" asChild>
                <Link to="/">Go to home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Resource Image Placeholder Migration</h1>
        <Button onClick={fetchResources} disabled={loading} className="mb-4">
          {loading ? "Loading..." : "Find Broken Images"}
        </Button>
        <div className="mb-4">{progress}</div>
        {resources.length > 0 && (
          <div>
            <div className="mb-4">{resources.length} resources with broken images.</div>
            <Button
              onClick={assignPlaceholders}
              disabled={loading}
              variant="destructive"
            >
              Auto Assign Placeholders to All
            </Button>
            <div className="mt-4 grid gap-2">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-12 h-8 rounded border overflow-hidden bg-muted">
                    <img
                      src={generatePlaceholderSvg(r.title)}
                      alt={`Placeholder for ${r.title}`}
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <span className="truncate">{r.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {done && (
          <div className="mt-6">
            <div className="text-green-600 font-semibold mb-3">
              Migration complete! {progress}
            </div>
            {errors.length > 0 ? (
              <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded">
                <div className="font-bold mb-2">
                  {errors.length} resource{errors.length !== 1 ? "s" : ""} failed:
                </div>
                <ul className="list-disc pl-5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-green-700">All resources migrated successfully!</div>
            )}
            <div className="mt-2 text-sm text-gray-600">
              You can refresh the page to check or re-run.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPlaceholderMigration;
