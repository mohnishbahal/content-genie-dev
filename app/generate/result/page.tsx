'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Download, ArrowLeft, Copy, Check, RefreshCw, Loader2, ArrowUpRight, Sparkles, FileText, Zap, Target, Pencil, Trash2, Plus, X } from 'lucide-react'
// import { GeneratedContent } from '@/types/generate'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toneOptions } from '@/constants/tones'

import {ContentService} from '@/lib/contentService'
import {FeedbackService} from '@/lib/feedbackService'
import { ExportService } from '@/lib/exportService'
import { SelectContent, SelectValue } from '@/components/select'

const contentService = new ContentService();
const feedbackService = new FeedbackService();

interface ContentMetrics {
  aiConfidence: number;
  readabilityScore: number;
  seoScore: number;
  toneMatch: number;
  uniqueness: number;
}

interface ContentTip {
  type: 'improvement' | 'success';
  message: string;
}

type ToneOption = {
  id: string;
  name: string;
  description: string;
};

interface FeedbackRatings {
  quality: number | null;
  creativity: number | null;
  speed: number | null;
  accuracy: number | null;
}

interface GeneratedContent {
  title: string;
  description: string;
  features: string[];
  keywords: string[];
  highlights: string[];
  stylingTips: string[];
  contentTips: ContentTip[];
  attributes: {
    [key: string]: string;
  };
  category?: string;
  brand?: string;
}

const defaultContent = {
  highlights: [
    'Perfect blend of comfort and style',
    'Versatile design for multiple occasions',
    'Premium quality construction',
    'Easy care and maintenance'
  ],
  stylingTips: [
    'Pair with ankle boots for a casual look',
    'Add a belt to define the waist',
    'Layer with a denim jacket for cooler days'
  ]
};

// Add dummy content for testing
const placeholder: GeneratedContent = {
  title: "",
  description: "",
  keywords: [
  ],
  features: [
  ],
  contentTips: [
    { type: 'success', message: 'Strong product title with optimal length' },
    { type: 'success', message: 'Well-structured description with good length' },
    { type: 'success', message: 'Comprehensive list of product features' },
    { type: 'success', message: 'Excellent tone consistency throughout the content' }
  ],
  highlights: [
  ],
  stylingTips: [
  ],
  attributes: {
    closure: "Pullover",
    design: "Cable Knit",
    length: "Midi",
    material: "Knit",
    occasion: "Casual, Semi-Formal, Evening",
    style: "Casual, Elegant",
    pattern: "Cable Knit with Embellishments",
    fit: "Relaxed",
    hemline: "Straight",
    colour: "Cream/Ivory",
    trend: "Classic, Modern",
    neckType: "Crew Neck",
    neckLine: "Round Neck",
    sleeveLength: "Long Sleeve"
  },
  category: "Women Skirts",
  brand: "Max Fashion"
};

const defaultTips : ContentTip[] = [
  { type: 'success', message: 'Strong product title with optimal length' },
  { type: 'success', message: 'Well-structured description with good length' },
  { type: 'success', message: 'Comprehensive list of product features' },
  { type: 'success', message: 'Excellent tone consistency throughout the content' }
];

export default function GenerateResultPage() {
  const router = useRouter()
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(placeholder)
  const [generatedContentAr, setGeneratedContentAr] = useState<GeneratedContent>(placeholder)
  const [imageUrl, setImageUrl] = useState<string | string[]>([])
  const [copiedStates, setCopiedStates] = useState({
    title: false,
    description: false,
    features: false,
    keywords: false
  })
  const [regeneratingField, setRegeneratingField] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<ContentMetrics>({
    aiConfidence: 90,
    readabilityScore: 100,
    seoScore: 100,
    toneMatch: 100,
    uniqueness: 90
  });
  const [selectedTone, setSelectedTone] = useState<string>('professional');
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [contentTips, setContentTips] = useState<ContentTip[]>(defaultTips);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [feedbackRatings, setFeedbackRatings] = useState<FeedbackRatings>({
    quality: null,
    creativity: null,
    speed: null,
    accuracy: null
  });
  const [isEditing, setIsEditing] = useState<{[key: string]: boolean}>({});
  const [editedContent, setEditedContent] = useState<{[key: string]: any}>({});
  const [editingAttributes, setEditingAttributes] = useState<{[key: string]: boolean}>({});
  const [language, setLanguage] = useState('english');
  const [contentId, setContentId] = useState(0);

  // Function to get content based on selected language
  const getLocalizedContent = (field: keyof GeneratedContent) => {
    return (language === 'arabic') ? generatedContentAr[field] : generatedContent[field];
  };

  useEffect(() => {
    const images = localStorage.getItem('uploadedImages')
    const content = localStorage.getItem('generatedContent');
    const tone = localStorage.getItem('tone');
    if (images) {
      setImageUrl(JSON.parse(images))
    }
    if (content) {
      const data = JSON.parse(content);
      setGeneratedContent(data.en);
      setGeneratedContentAr(data.ar);
      setContentId(data.id);
      setSelectedTone(tone);
    }
  }, [])

  useEffect(() => {
    const analyzeContent = async () => {
      if (!generatedContent) return;
      
      try {
        const response = await fetch('http://127.0.0.1:5000/analyze-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: generatedContent
          }),
        });

        if (!response.ok) throw new Error('Failed to analyze content');

        const data = await response.json();
        setMetrics(data.metrics);
        setContentTips(data.tips);
      } catch (error) {
        console.error('Error analyzing content:', error);
      }
    };

    analyzeContent();
  }, [generatedContent]);

  const handleCopy = async (text: string, field: keyof typeof copiedStates) => {
    await navigator.clipboard.writeText(text)
    setCopiedStates(prev => ({ ...prev, [field]: true }))
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [field]: false }))
    }, 2000)
  }

  const handleRegenerate = async (field: string) => {
    if (!generatedContent) return;
    setRegeneratingField(field);
    setError(null);
    const image_name = JSON.parse(localStorage.getItem('imageName')?.toString() ?? "")
    try {
        const regenerateData = {
          image : image_name,
          tone: selectedTone,
          aiModel: "gemini-1.5",
          field_name : field,
          content_id :localStorage.getItem('contentId'),
          template_name :localStorage.getItem('category'),
          language : language
        };

      const response = await contentService.regenerateContentForAttributes(regenerateData)  

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate content');
      }

      // Update the specific field in generatedContent
      if (language == 'english'){
        setGeneratedContent(data);
      }else if(language == 'arabic'){
        setGeneratedContentAr(data);
      }
        

      // Trigger content analysis after regeneration
      // const updatedContent = {
      //   ...generatedContent,
      //   [field]: data[field]
      // };

      // const analysisResponse = await fetch('http://127.0.0.1:5000/analyze-content', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     content: updatedContent
      //   }),
      // });

      // if (analysisResponse.ok) {
      //   const analysisData = await analysisResponse.json();
      //   setMetrics(analysisData.metrics);
      //   setContentTips(analysisData.tips);
      // }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate content';
      setError(errorMessage);
      console.error('Regeneration error:', err);
    } finally {
      setRegeneratingField(null);
    }
  };

  const handleDownloadAll = () => {
    if (!generatedContent) return
    
    const obj : GeneratedContent = (language === 'arabic') ? generatedContentAr : generatedContent;

    const exporter : ExportService = new ExportService();
    const content = exporter.convertComplexJSONToCSV([obj]);
    const fileName: string = `${generatedContent.title}-${language}.csv`;

    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleRegenerateAll = async () => {
    if (!generatedContent) return;
    setIsRegeneratingAll(true);
    setError(null);
    const image_name = JSON.parse(localStorage.getItem('imageName')?.toString() ?? "")
    try {

        const formInfo = {
          image : image_name,
          aiModel: 'gemini-1.5',
          tone: selectedTone,
          templateName: localStorage.getItem('category')
        }
      
        const response = await contentService.generateContent(formInfo)

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to regenerate content');
        }

        // Update content and store in localStorage
        setGeneratedContent(data.en)
        setGeneratedContentAr(data.ar)
        
        localStorage.setItem('contentId', data.id)
        localStorage.setItem('generatedContent', JSON.stringify(data));

      // Trigger content analysis after regeneration
      // const analysisResponse = await fetch('http://127.0.0.1:5000/analyze-content', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     content: data
      //   }),
      // });

      // if (analysisResponse.ok) {
      //   const analysisData = await analysisResponse.json();
      //   setMetrics(analysisData.metrics);
      //   setContentTips(analysisData.tips);
      // }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate content';
      setError(errorMessage);
      console.error('Regeneration error:', err);
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  function MetricCard({ 
    label, 
    value, 
    description 
  }: { 
    label: string; 
    value: number; 
    description: string;
  }) {
    const getColorClass = (value: number) => {
      if (value >= 90) return 'text-green-600 bg-green-50';
      if (value >= 70) return 'text-blue-600 bg-blue-50';
      return 'text-orange-600 bg-orange-50';
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <div className={`px-2 py-1 rounded-full text-sm font-medium ${getColorClass(value)}`}>
              {value}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
              style={{ width: `${value}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        </div>
      </div>
    );
  }

  const calculateOverallScore = (metrics: ContentMetrics) => {
    const scores = [
      metrics.aiConfidence,
      metrics.readabilityScore,
      metrics.seoScore,
      metrics.toneMatch,
      metrics.uniqueness
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const handleRegenerateAttribute = async (attributeKey: string) => {
    if (!generatedContent) return;
    setRegeneratingField(`attributes.${attributeKey}`);
    setError(null);
    const image_name = JSON.parse(localStorage.getItem('imageName')?.toString() ?? "")
    try {
        const regenerateData = {
              image : image_name,
              tone: selectedTone,
              aiModel: "gemini-1.5",
              field_name : attributeKey,
              content_id :localStorage.getItem('contentId'),
              template_name :localStorage.getItem('category'),
              language : language
            };

        const response = await contentService.regenerateContentForAttributes(regenerateData)  

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to regenerate attribute');
        }

        // Update the specific attribute in generatedContent
        if (language == 'english'){
          setGeneratedContent(data);
        }else if(language == 'arabic'){
          setGeneratedContentAr(data);
        }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate attribute';
      setError(errorMessage);
      console.error('Regeneration error:', err);
    } finally {
      setRegeneratingField(null);
    }
  };

  const handleResetFeedback = () => {
    setFeedbackRatings({
      quality: null,
      creativity: null,
      speed: null,
      accuracy: null
    });
    setFeedback('');
  };

  const handleContentEdit = async (field: string, value: any) => {
    setEditedContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewContent =  async (field: string, value: any) => {
    setError(null);
    try {
        const new_content_data = {
          field_name : field,
          content_id :localStorage.getItem('contentId'),
          new_content: value,
          language : language
        };

      const response = await contentService.addNewOrUpdateContent(new_content_data)  

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate content');
      }
      
      setEditedContent(prev => ({
        ...prev,
        [field]: value
      }));
    if(language == 'english'){
      setGeneratedContent(data.en)
    }else{
      setGeneratedContentAr(data.ar)
    }
    localStorage.setItem("generatedContent",JSON.stringify(data))
    }catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit the content';
      setError(errorMessage);
      console.error('Content Editing error:', err);
    }
  };

  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords?.length) return text;
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      // Case insensitive search
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, 
        '<span class="bg-orange-100 text-orange-800 rounded px-1">$1</span>'
      );
    });
    return highlightedText;
  };

  const countKeywordUsage = (text: string, keywords: string[]) => {
    if (!keywords?.length) return 0;
    const uniqueUsedKeywords = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    return uniqueUsedKeywords.length;
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    
    try {
      const feedbackData = {
        creativity_rating: feedbackRatings.creativity ?? 0,
        content_quality_rating: feedbackRatings.quality ?? 0 ,
        generation_speed_rating: feedbackRatings.speed ?? 0,
        content_accuracy_rating: feedbackRatings.accuracy ?? 0,
        additional_comments: feedback ?? "",
        content_id: contentId,
        email:"test@gmail.com"
      };

      feedbackService.generateContent(feedbackData);

      setShowFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackSuccess(false);
      }, 3000);

      // Reset form
      setFeedback('');
      setFeedbackRatings({
        quality: null,
        creativity: null,
        speed: null,
        accuracy: null
      });
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleRatingChange = (category: keyof FeedbackRatings, value: number) => {
    setFeedbackRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  if (!generatedContent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No content generated</h2>
          <p className="mt-2 text-gray-600">Please try generating content first.</p>
          <Link href="/generate">
            <Button className="mt-4">Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Navigation Bar with Language Selector */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link 
                href="/generate" 
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                Back to Generator
              </Link>

              {/* Language Selector */}
              <div className="hidden sm:block">
              <Tabs 
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value);
                    // Reset any edited content when switching languages
                    setEditedContent({});
                  }}
                  className="w-full"
                >
                  <TabsList className="inline-flex h-8 p-1 gap-1 bg-gray-100/80 rounded-lg">
                    <TabsTrigger value="english">
                      English
                    </TabsTrigger>
                    <TabsTrigger value="arabic">
                      Arabic
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleDownloadAll}
                variant="outline"
                className="text-gray-700 border-gray-200 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button
                onClick={() => router.push('/generate')} 
                className="border-2 border-orange-500 bg-white text-orange-500 hover:bg-orange-50 px-8 py-2 rounded-full transition-all"
              >
                Generate Another
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Language Selector */}
        <div className="sm:hidden border-t border-gray-100">
          <div className="px-4 py-2">
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="inline-flex w-full p-1 gap-1 bg-gray-100/80 rounded-lg">
                <TabsTrigger 
                  value="english" 
                  className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
                >
                  English
                </TabsTrigger>
                <TabsTrigger 
                  value="arabic" 
                  className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
                >
                  Arabic
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="md:col-span-3 space-y-6">
              {/* Product Images Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Product Images</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {imageUrl && (Array.isArray(imageUrl) ? imageUrl : [imageUrl]).map((url, index) => (
                      <div 
                      key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                      >
                        <Image
                      src={url}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category and Brand Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Template & Brand Information</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Selected Template</p>
                    <p className="text-sm text-gray-900">{getLocalizedContent('category') || localStorage.getItem('category')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="text-sm text-gray-900">{getLocalizedContent('brand') || 'Max'}</p>
                  </div>
                </div>
              </div>

              {/* Content Quality Score */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900">Content Quality Score</h2>
    </div>
                
                {/* Overall Score */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          className="text-gray-100"
                          strokeWidth="5"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="32"
                          cy="32"
                        />
                        <circle
                          className="text-orange-500 transition-all duration-1000"
                          strokeWidth="5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="32"
                          cy="32"
                          strokeDasharray={`${2 * Math.PI * 30}`}
                          strokeDashoffset={`${2 * Math.PI * 30 * (1 - calculateOverallScore(metrics) / 100)}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-900">{calculateOverallScore(metrics)}</span>
              </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Overall Score</div>
                      <div className="text-sm text-gray-500">Based on all metrics</div>
                    </div>
                  </div>
                </div>

                {/* Individual Scores */}
                <div className="p-6">
                  {[
                    {
                      label: 'AI Confidence',
                      subLabel: 'Accuracy confidence',
                      value: metrics.aiConfidence,
                    },
                    {
                      label: 'Readability',
                      subLabel: 'Easy to understand',
                      value: metrics.readabilityScore,
                    },
                    {
                      label: 'SEO Score',
                      subLabel: 'Search optimization',
                      value: metrics.seoScore,
                    },
                    {
                      label: 'Tone Match',
                      subLabel: 'Style consistency',
                      value: metrics.toneMatch,
                    },
                    {
                      label: 'Uniqueness',
                      subLabel: 'Content originality',
                      value: metrics.uniqueness,
                    },
                  ].map(({ label, subLabel, value }) => (
                    <div key={label} className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{label}</div>
                          <div className="text-xs text-gray-500">{subLabel}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{value}%</div>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-500 rounded-full"
                          style={{ 
                            width: `${value}%`,
                            opacity: value >= 90 ? 1 : 0.7
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900">Tips & Recommendations</h2>
                </div>
                <div className="p-4 divide-y divide-gray-100">
                  {contentTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <div className={`mt-1 p-1 rounded-full ${
                        tip.type === 'success' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {tip.type === 'success' ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                      </div>
                      <p className={`text-sm ${
                        tip.type === 'success' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {tip.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    These recommendations are based on AI analysis of your content and industry best practices.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900">Help Us Improve</h2>
                  <p className="text-sm text-gray-500 mt-1">Your feedback helps us enhance the content generation</p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Parameter Ratings with Visual Scale */}
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      {
                        key: 'quality',
                        label: 'Content Quality',
                        description: 'How well-written and professional is the content?',
                        icon: <FileText className="w-4 h-4" />
                      },
                      {
                        key: 'creativity',
                        label: 'Creativity',
                        description: 'How unique and innovative is the generated content?',
                        icon: <Sparkles className="w-4 h-4" />
                      },
                      {
                        key: 'speed',
                        label: 'Generation Speed',
                        description: 'How satisfied are you with the generation speed?',
                        icon: <Zap className="w-4 h-4" />
                      },
                      {
                        key: 'accuracy',
                        label: 'Content Accuracy',
                        description: 'How accurate is the content to your product?',
                        icon: <Target className="w-4 h-4" />
                      }
                    ].map(({ key, label, description, icon }) => (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                            {icon}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-900">{label}</label>
                            <p className="text-xs text-gray-500">{description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFeedbackRatings(prev => ({
                                ...prev,
                                [key]: star
                              }))}
                              className={`group relative p-1`}
                            >
                              <div className={`w-8 h-8 rounded-lg transition-all ${
                                feedbackRatings[key as keyof FeedbackRatings] && star <= feedbackRatings[key as keyof FeedbackRatings]! 
                                  ? 'bg-orange-500 text-white' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-500'
                              }`}>
                                <div className="h-full w-full flex items-center justify-center">
                                  {star}
                                </div>
                              </div>
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {star === 1 ? 'Poor' : 
                                 star === 2 ? 'Fair' : 
                                 star === 3 ? 'Good' : 
                                 star === 4 ? 'Very Good' : 
                                 'Excellent'}
                              </div>
                            </button>
                          ))}
                          {/* {feedbackRatings[key as keyof FeedbackRatings] && (
                            <span className="text-sm text-gray-500 ml-2">
                              {feedbackRatings[key as keyof FeedbackRatings] === 5 ? 'Excellent' :
                               feedbackRatings[key as keyof FeedbackRatings] === 4 ? 'Very Good' :
                               feedbackRatings[key as keyof FeedbackRatings] === 3 ? 'Good' :
                               feedbackRatings[key as keyof FeedbackRatings] === 2 ? 'Fair' : 'Poor'}
                    </span>
                          )} */}
                        </div>
                      </div>
                  ))}
                </div>

                  {/* Additional Comments */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-900">
                      Additional Comments
                      <span className="font-normal text-gray-500 ml-1">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share any specific feedback or suggestions for improvement..."
                      className="mt-2 w-full px-4 py-3 text-sm text-gray-600 placeholder:text-gray-400 placeholder:text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button and Success Message */}
                  <div className="relative flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleFeedbackSubmit}
                        disabled={isSubmittingFeedback}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 px-6"
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Feedback'
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleResetFeedback}
                        disabled={isSubmittingFeedback || (!Object.values(feedbackRatings).some(rating => rating !== null) && !feedback)}
                        className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                      >
                        Reset
                      </Button>
                    </div>

                    {showFeedbackSuccess && (
                      <div 
                        className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-lg border border-green-100 shadow-sm animate-in fade-in duration-200"
                      >
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Thank you for your feedback!</p>
                          <p className="text-xs text-green-500">Your input helps us improve</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Generated Content */}
            <div className="md:col-span-9">
              {/* Tone Control Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Content Tone</h3>
                      <p className="text-xs text-gray-500 mt-1">Select tone to regenerate all content</p>
                    </div>
          <Button
            variant="ghost"
                      size="sm"
                      onClick={handleRegenerateAll}
                      disabled={isRegeneratingAll}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isRegeneratingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {toneOptions.map((tone) => (
                      <div
                        key={tone.id}
                        className={`relative flex flex-col p-3 rounded-lg cursor-pointer transition-all ${
                          selectedTone === tone.id 
                            ? 'bg-orange-50 border-2 border-orange-500' 
                            : 'border border-gray-200 hover:border-orange-200'
                        }`}
                        onClick={async () => {
                          setSelectedTone(tone.id);
                          await handleRegenerateAll();
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${
                            selectedTone === tone.id ? 'text-orange-700' : 'text-gray-900'
                          }`}>
                            {tone.name}
                          </p>
                          {selectedTone === tone.id && (
                            <div className="h-2 w-2 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <p className={`text-xs ${
                          selectedTone === tone.id ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {tone.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-6">
                {/* Content Sections */}
                {[
                  {
                    label: 'Title',
                    content: editedContent.title || getLocalizedContent('title'),
                    field: 'title',
                    render: (content: string, label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
                                if(isEditing[field]){
                                  handleNewContent(field,editedContent.title);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isEditing[field] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(content, field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          {isEditing[field] ? (
                            <textarea
                              value={editedContent[field] || content}
                              onChange={(e) => handleContentEdit(field, e.target.value)}
                              className="w-full min-h-[60px] px-3 py-2 text-xl font-semibold text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                              placeholder="Enter title..."
                            />
                          ) : (
                            <h2 className="text-xl font-semibold text-gray-900">{content}</h2>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'SEO Keywords',
                    content: editedContent.keywords || getLocalizedContent('keywords'),
                    field: 'keywords',
                    render: (content: string[], label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                            <span className="text-sm text-orange-600">
                              • {(content || []).filter(keyword => 
                                generatedContent.description.toLowerCase().includes(keyword.toLowerCase())
                              ).length} used
                            </span>
                          </div>
                          <div className="flex gap-1 flex-no-rtl">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
                                if(isEditing[field]){
                                  handleNewContent(field,editedContent.keywords);
                                }
                              }}  
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isEditing[field] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(content.join(', '), field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          {isEditing[field] ? (
                            <div className="space-y-2">
                              {(content || []).map((keyword, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    value={keyword}
                                    onChange={(e) => {
                                      const newKeywords = [...(content || [])];
                                      newKeywords[index] = e.target.value;
                                      handleContentEdit(field, newKeywords);
                                    }}
                                    className="flex-1 px-3 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    placeholder={`Keyword ${index + 1}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newKeywords = (content || []).filter((_, i) => i !== index);
                                      handleContentEdit(field, newKeywords);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleContentEdit(field, [...(content || []), '']);
                                }}
                                className="w-full mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Keyword
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {(content || []).map((keyword, index) => {
                                const isUsed = generatedContent.description
                                  .toLowerCase()
                                  .includes(keyword.toLowerCase());
                                
                                return (
                                  <div key={index} 
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                      isUsed ? 'bg-orange-50 text-orange-800' : 'bg-gray-50 text-gray-600'
                                    }`}
                                  >
                                    {language === 'arabic' ? (
                                      <>
                                        <span className="text-sm">{keyword}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                          isUsed ? 'bg-orange-500' : 'bg-gray-300'
                                        }`} />
                                      </>
                                    ) : (
                                      <>
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                          isUsed ? 'bg-orange-500' : 'bg-gray-300'
                                        }`} />
                                        <span className="text-sm">{keyword}</span>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <p className="mt-4 text-xs text-gray-500 flex items-center gap-1.5">
                            <svg 
                              className="w-3.5 h-3.5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            Keywords will be automatically highlighted in the description
                          </p>
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Description',
                    content: editedContent.description || getLocalizedContent('description'),
                    field: 'description',
                    render: (content: string, label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
                                if(isEditing[field]){
                                  handleNewContent(field,editedContent.description);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isEditing[field] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(content, field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          {isEditing[field] ? (
                            <textarea
                              value={content}
                              onChange={(e) => handleContentEdit(field, e.target.value)}
                              className="w-full min-h-[120px] px-3 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-y"
                              placeholder="Enter description..."
                            />
                          ) : (
                            <p 
                              className="text-gray-600 leading-relaxed"
                              dir={language === 'arabic' ? 'rtl' : 'ltr'}
                            >
                              {content}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Product Features',
                    content: editedContent.features || getLocalizedContent('features'),
                    field: 'features',
                    render: (content: string[], label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                          <div className="flex gap-1 flex-no-rtl">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
                                if(isEditing[field]){
                                  handleNewContent(field,editedContent.features);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isEditing[field] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(content.join('\n'), field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          {isEditing[field] ? (
                            <div className="space-y-2">
                              {(content || []).map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    value={feature}
                                    onChange={(e) => {
                                      const newFeatures = [...(content || [])];
                                      newFeatures[index] = e.target.value;
                                      handleContentEdit(field, newFeatures);
                                    }}
                                    className="flex-1 px-3 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    placeholder={`Feature ${index + 1}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newFeatures = (content || []).filter((_, i) => i !== index);
                                      handleContentEdit(field, newFeatures);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleContentEdit(field, [...(content || []), '']);
                                }}
                                className="w-full mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Feature
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {(content || []).map((feature, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  {language === 'arabic' ? (
                                    <>
                                      <span className="text-gray-600 text-right w-full">{feature}</span>
                                      <div className="w-2 h-2 mt-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-2 h-2 mt-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                                      <span className="text-gray-600">{feature}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Product Highlights',
                    content: editedContent.highlights || getLocalizedContent('highlights'),
                    field: 'highlights',
                    render: (content: string[], label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                          <div className="flex gap-1 flex-no-rtl">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(prev => ({ ...prev, [field]: !prev[field] }))
                                if(isEditing[field]){
                                  handleNewContent(field,editedContent.highlights);
                                }
                              }}
                                
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isEditing[field] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(content.join('\n'), field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          {isEditing[field] ? (
                            <div className="space-y-2">
                              {content.map((highlight, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    value={highlight}
                                    onChange={(e) => {
                                      const newHighlights = [...content];
                                      newHighlights[index] = e.target.value;
                                      handleContentEdit(field, newHighlights);
                                    }}
                                    className="flex-1 px-3 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    placeholder={`Highlight ${index + 1}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newHighlights = content.filter((_, i) => i !== index);
                                      handleContentEdit(field, newHighlights);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleContentEdit(field, [...content, '']);
                                }}
                                className="w-full mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Highlight
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {(content || []).map((highlight, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  {language === 'arabic' ? (
                                    <>
                                      <span className="text-gray-600 text-base text-right w-full">{highlight}</span>
                                      <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-orange-600 text-sm">{index + 1}</span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-orange-600 text-sm">{index + 1}</span>
                                      </div>
                                      <span className="text-gray-600 text-base">{highlight}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Styling Tips',
                    content: editedContent.stylingTips || getLocalizedContent('stylingTips'),
                    field: 'stylingTips',
                    render: (content: string[], label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                          <div className="flex gap-1 flex-no-rtl">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
                                if(isEditing[field]){
                                  handleNewContent(field,editedContent.stylingTips);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isEditing[field] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(content.join('\n'), field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          {isEditing[field] ? (
                            <div className="space-y-2">
                              {content.map((tip, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    value={tip}
                                    onChange={(e) => {
                                      const newTips = [...content];
                                      newTips[index] = e.target.value;
                                      handleContentEdit(field, newTips);
                                    }}
                                    className="flex-1 px-3 py-2 text-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    placeholder={`Styling Tip ${index + 1}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newTips = content.filter((_, i) => i !== index);
                                      handleContentEdit(field, newTips);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleContentEdit(field, [...(content || []), '']);
                                }}
                                className="w-full mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Styling Tip
                              </Button>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {content.map((tip, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  {language === 'arabic' ? (
                                    <>
                                      <span className="text-gray-600 text-base text-right w-full">{tip}</span>
                                      <div className="w-5 h-5 mt-0.5 flex items-center justify-center flex-shrink-0 text-orange-500">
                                        <Sparkles className="w-5 h-5" />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-5 h-5 mt-0.5 flex items-center justify-center flex-shrink-0 text-orange-500">
                                        <Sparkles className="w-5 h-5" />
                                      </div>
                                      <span className="text-gray-600 text-base">{tip}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Product Attributes',
                    content: editedContent.attributes || getLocalizedContent('attributes'),
                    field: 'attributes',
                    render: (content: Record<string, string>, label: string, field: string) => (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                           dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                          <div className="flex gap-1 flex-no-rtl">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(field)}
                              disabled={regeneratingField === field}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {regeneratingField === field ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(JSON.stringify(content), field as keyof typeof copiedStates)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedStates[field as keyof typeof copiedStates] ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(content).map(([key, value]) => (
                              
                              <div 
                                key={key} 
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100/70 transition-colors flex-no-rtl"
                              >
                                <span className="text-sm font-medium text-gray-500 keep-ltr">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <div className="flex items-center gap-2">
                                  {editingAttributes[key] ? (
                                    <div className="flex items-center gap-2">
                                      <input type="text"
                                        value={value}
                                        onChange={(e) => {                                         
                                          const _attributes = { ...content };
                                          _attributes[key] = e.target.value;
                                          handleContentEdit('attributes', _attributes);
                                        }}
                                        className="w-[200px] px-2 py-1 text-sm text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                        placeholder={`Enter ${key}`}
                                      ></input>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditingAttributes(prev => ({ ...prev, [key]: false }))
                                          // console.log(value)
                                          if(editingAttributes[key]){
                                            handleNewContent(key,value);
                                          }
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <Check className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className={`text-sm text-gray-900 ${language === 'arabic' ? 'text-right' : ''}`}>
                                        {value}
                                      </span>
                                      <div className="flex items-center gap-1 flex-no-rtl">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setEditingAttributes(prev => ({ ...prev, [key]: true }))}
                                          className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                          title="Edit this attribute"
                                        >
                                          <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleRegenerateAttribute(key)}
                                          disabled={regeneratingField === `attributes.${key}`}
                                          className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                          title="Regenerate this attribute"
                                        >
                                          {regeneratingField === `attributes.${key}` ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <RefreshCw className="h-3.5 w-3.5" />
                                          )}
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  }
                ].map(({ label, content, field, render }) => (
                  <div key={field}>
                    {render(content, label, field)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-white border border-red-100 text-red-600 p-4 rounded-xl shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}

