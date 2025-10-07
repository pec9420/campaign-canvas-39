import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  fileType: "business_info" | "brand_voice" | "persona_research";
  onUploadComplete: (fileUrl: string, extractedText: string) => void;
}

export function FileUploadModal({
  open,
  onClose,
  profileId,
  fileType,
  onUploadComplete,
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload PDF, TXT, or DOCX files only");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 20MB");
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload to Supabase Storage
      const fileName = `${profileId}/${fileType}/${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("brand-hub-files")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;
      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("brand-hub-files")
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from("brand_hub_uploads")
        .insert({
          profile_id: profileId,
          file_type: fileType,
          file_name: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
        });

      if (dbError) throw dbError;
      setUploadProgress(75);

      // Call edge function to process file
      const { data: processData, error: processError } = await supabase.functions.invoke(
        "process-brand-upload",
        {
          body: {
            fileUrl: publicUrl,
            fileType,
            profileId,
          },
        }
      );

      if (processError) throw processError;
      setUploadProgress(100);

      toast.success("File uploaded and processed successfully!");
      onUploadComplete(publicUrl, processData.suggestions);
      onClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {fileType.replace(/_/g, " ")} File</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop your file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, TXT, or DOCX (max 20MB)
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {uploading && (
                <div className="mt-4 space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-muted-foreground text-center">
                    {uploadProgress < 50 && "Uploading..."}
                    {uploadProgress >= 50 && uploadProgress < 75 && "Saving..."}
                    {uploadProgress >= 75 && "Processing with AI..."}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Uploading..." : "Upload & Process"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
