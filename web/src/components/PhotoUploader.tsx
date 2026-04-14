'use client';

import { useRef, useState } from 'react';

interface Props {
  appointmentId: string | number;
  type: 'before' | 'after';
  initialUrls: string[];
  onUrlsChange: (urls: string[]) => void;
  label: string;
  colorClass: string;
}

export default function PhotoUploader({ appointmentId, type, initialUrls, onUrlsChange, label, colorClass }: Props) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);

      const res = await fetch(`/api/portal/appointments/${appointmentId}/upload-photo`, {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const { url } = await res.json();
        newUrls.push(url);
      }
    }

    setUploading(false);
    const updated = [...urls, ...newUrls];
    setUrls(updated);
    onUrlsChange(updated);
  }

  function removeUrl(idx: number) {
    const updated = urls.filter((_, i) => i !== idx);
    setUrls(updated);
    onUrlsChange(updated);
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>

      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {urls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${type} ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold
                  opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`w-full border-2 border-dashed rounded-xl py-3 text-xs font-semibold transition-colors
          ${uploading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : `${colorClass} cursor-pointer`
          }`}>
        {uploading
          ? '⏳ Đang tải lên...'
          : `+ Thêm ảnh ${type === 'before' ? 'trước' : 'sau'} điều trị`}
      </button>
    </div>
  );
}
