import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// Use the local pdfjs-dist worker with Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// Helper to normalize type
function getNormalizedType(type, fileName = '') {
  if (!type && fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'IMAGE';
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'VIDEO';
  }
  if (!type) return '';
  const t = type.toString().toLowerCase();
  if (t === 'pdf' || t === 'application/pdf') return 'PDF';
  if (t === 'image' || t.startsWith('image/')) return 'IMAGE';
  if (t === 'video' || t.startsWith('video/')) return 'VIDEO';
  if (t === 'doc' || t === 'application/msword' || t === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOC';
  if (t === 'ppt' || t === 'application/vnd.ms-powerpoint' || t === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'PPT';
  return t.toUpperCase();
}

const ContentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contentUrl, setContentUrl] = useState<string>('');
  const [contentBlob, setContentBlob] = useState<Blob | null>(null);
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    // Fetch material metadata (optional, for type)
    fetch(`${import.meta.env.VITE_API_URL}/content/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setMaterial(data.data);
        console.log('Material:', data.data);
      })
      .catch((e) => {
        setMaterial(null);
        setError('Failed to fetch material metadata.');
        console.error(e);
      });
    // Fetch file blob
    fetch(`${import.meta.env.VITE_API_URL}/content/view/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load content');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setContentUrl(url);
        setContentBlob(blob);
        setLoading(false);
        console.log('Content URL:', url);
      })
      .catch((e) => {
        setError('Failed to load content.');
        setLoading(false);
        console.error(e);
      });
    return () => {
      if (contentUrl) URL.revokeObjectURL(contentUrl);
    };
    // eslint-disable-next-line
  }, [id]);

  let viewer = null;
  const normalizedType = getNormalizedType(material?.file_type || material?.type, material?.file_name || material?.title);
  if (material && contentBlob) {
    if (normalizedType === 'PDF') {
      viewer = (
        <div style={{ width: '100%', height: '90vh', overflow: 'auto', background: '#fff', display: 'flex', justifyContent: 'center' }}>
          <Document
            file={contentBlob}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div style={{ textAlign: 'center', marginTop: 40 }}>Loading PDF...</div>}
            error={<div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Failed to load PDF.</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={true}
              />
            ))}
          </Document>
        </div>
      );
    } else if (normalizedType === 'IMAGE') {
      // Block right-click and drag
      viewer = (
        <img
          src={contentUrl}
          alt={material.file_name || material.title}
          style={{ maxWidth: '100%', maxHeight: '90vh', margin: '0 auto', display: 'block', background: '#fff' }}
          onContextMenu={e => e.preventDefault()}
          draggable={false}
        />
      );
    } else if (normalizedType === 'VIDEO') {
      // Block download and right-click
      viewer = (
        <video
          src={contentUrl}
          controls
          controlsList="nodownload"
          style={{ width: '100%', maxHeight: '90vh', margin: '0 auto', display: 'block', background: '#fff' }}
          onContextMenu={e => e.preventDefault()}
        />
      );
    } else {
      // Do not show a download link for other types
      viewer = (
        <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>
          Preview not available for this file type.<br />
          <span style={{ fontSize: 12, color: '#888' }}>Type: {material.file_type || material.type}</span>
        </div>
      );
    }
  }

  return (
    <div style={{ background: '#f4f4f5', minHeight: '100vh', padding: 0, margin: 0 }}>
      <Button
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
        variant="outline"
        onClick={() => navigate('/admin/content')}
      >
        Close
      </Button>
      {loading && (
        <div style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span style={{ marginLeft: 16 }}>Loading content...</span>
        </div>
      )}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>
      )}
      {!loading && !error && (!material || !contentBlob) && (
        <div style={{ color: '#333', textAlign: 'center', marginTop: 40 }}>
          No content available.<br />
          <span style={{ fontSize: 12, color: '#888' }}>Debug: material={JSON.stringify(material)} contentUrl={contentUrl}</span>
        </div>
      )}
      {!loading && !error && viewer}
      {!loading && !error && material && contentBlob && !['PDF','IMAGE','VIDEO'].includes(normalizedType) && (
        <div style={{ color: '#333', textAlign: 'center', marginTop: 20 }}>
          Unsupported file type: {material.file_type || material.type}
        </div>
      )}
    </div>
  );
};

export default ContentViewer; 