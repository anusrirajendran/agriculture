import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import GlassCard from '../components/ui/GlassCard';
import {
  ShieldAlert,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

const commonCrops = ['Paddy (Rice)', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Potato', 'Sugarcane', 'Onion', 'Chili', 'Mango'];

interface DiagnosisReportType {
  crop: string;
  symptoms: string;
  imageUrl: string;
  diagnosis: string;
}

export const CropAdvisory: React.FC = () => {
  const { t } = useTranslation();

  const [crop, setCrop] = useState(commonCrops[0]);
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DiagnosisReportType | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return setError('Image file is too large. Limit is 5MB.');
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError('');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        return setError('Only image files are allowed');
      }
      if (file.size > 5 * 1024 * 1024) {
        return setError('Image file is too large. Limit is 5MB.');
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!symptoms.trim()) {
      return setError('Please describe the symptoms of the disease');
    }

    setLoading(true);
    setReport(null);

    const formData = new FormData();
    formData.append('crop', crop);
    formData.append('symptoms', symptoms);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await api.post('/disease/diagnose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete disease diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {t.diseaseAdvisory}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Upload an image of your diseased crop leaf and describe symptoms for instant AI treatment and recovery plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Form Input Card */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-500" />
            Diagnosis Request
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Crop selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm cursor-pointer"
              >
                {commonCrops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Drag & Drop File Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                {t.uploadImage}
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="inline-flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-full text-slate-400 group-hover:text-emerald-500 transition-colors mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Drag and drop here, or <span className="text-emerald-600 dark:text-emerald-400">browse file</span>
                    </span>
                    <span className="block text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-950">
                  <img src={imagePreview} alt="Leaf Preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Symptoms Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.describeSymptoms}
              </label>
              <textarea
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe leaf yellowing, white spots, drying margins, brown holes, or insect attacks..."
                rows={4}
                className="mt-1.5 block w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center gap-2 w-full px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all cursor-pointer shadow-md shadow-emerald-500/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Diagnosing Leaf Health...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  {t.analyze}
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Diagnosis Report Output Card */}
        <div className="space-y-6">
          {loading && (
            <div className="glass-card p-8 rounded-2xl text-center space-y-4 flex flex-col items-center justify-center border border-dashed border-emerald-500/30">
              <Sparkles className="w-10 h-10 text-emerald-500 animate-spin" />
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">AI Advisory diagnosing...</h3>
                <p className="text-xs text-slate-400 mt-1">Analyzing leaf tissues, symptom patterns, and treatment formulas.</p>
              </div>
            </div>
          )}

          {!loading && !report && (
            <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-8 text-center text-sm text-slate-400">
              Submit symptoms and image to display diagnostic results.
            </div>
          )}

          {report && (
            <Card className="p-6 overflow-hidden space-y-5 border-l-4 border-l-emerald-500 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-800 dark:text-white">Diagnosis Advisory Report</span>
              </div>

              {report.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 aspect-video max-h-48 bg-slate-50 dark:bg-slate-950">
                  <img src={report.imageUrl} alt="Diagnosed Leaf" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: report.diagnosis.replace(/\n/g, '<br />') }} />
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Verify organic remedies on a small branch before full crop application.</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
export default CropAdvisory;
