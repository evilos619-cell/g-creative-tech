import { useCallback, useRef, useState } from "react";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Storage bucket name. Default: "media". */
  bucket?: string;
  /** Folder path inside the bucket. Default: "uploads". */
  folder?: string;
  /** Accepted MIME types. Default: images. */
  accept?: string;
  /** Max size in MB. Default: 5. */
  maxSizeMB?: number;
  label?: string;
};

/**
 * FileUpload — drag-and-drop + click-to-pick image uploader backed by Supabase Storage.
 * Stores files in the configured bucket and returns the resulting public URL.
 */
export function FileUpload({
  value,
  onChange,
  bucket = "media",
  folder = "uploads",
  accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  maxSizeMB = 5,
  label = "Image",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const acceptList = accept.split(",").map((s) => s.trim());

  const validate = (file: File): string | null => {
    if (!acceptList.includes(file.type)) return `Unsupported file type: ${file.type}`;
    if (file.size > maxSizeMB * 1024 * 1024) return `File exceeds ${maxSizeMB} MB limit`;
    return null;
  };

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setUploading(true);
      setProgress(20);
      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const path = `${folder}/${crypto.randomUUID()}.${ext}`;
        setProgress(50);
        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
        if (upErr) throw upErr;
        setProgress(85);
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
        if (!pub?.publicUrl) throw new Error("Failed to resolve public URL");
        setProgress(100);
        onChange(pub.publicUrl);
      } catch (e: any) {
        setError(e?.message ?? "Upload failed");
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 600);
      }
    },
    [bucket, folder, onChange],
  );

  const onFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    upload(files[0]);
  };

  const removeImage = async () => {
    if (!value) return;
    // Try to delete from storage if the URL belongs to our bucket
    try {
      const marker = `/storage/v1/object/public/${bucket}/`;
      const idx = value.indexOf(marker);
      if (idx !== -1) {
        const path = value.slice(idx + marker.length);
        await supabase.storage.from(bucket).remove([path]);
      }
    } catch {
      // ignore — clearing the field is still valid
    }
    onChange("");
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {value ? (
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <img src={value} alt={label} className="h-16 w-16 rounded-lg object-cover bg-secondary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground truncate">{value}</p>
            <div className="mt-2 flex gap-2">
              <Button type="button" size="sm" variant="glass" onClick={() => inputRef.current?.click()} disabled={uploading}>
                <Upload className="h-3 w-3" /> Replace
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={removeImage} disabled={uploading}>
                <X className="h-3 w-3" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFiles(e.dataTransfer.files);
          }}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-secondary/40"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Uploading… {progress}%</span>
              <div className="w-full max-w-xs h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-sm">
              <ImageIcon className="h-6 w-6 text-primary" />
              <span className="font-medium">Click or drop to upload</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF, SVG · max {maxSizeMB} MB</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
