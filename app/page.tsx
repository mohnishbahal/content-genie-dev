'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, Globe2, Zap, Upload, Sparkles, Download, ChevronDown, ArrowUp, Check, Clock, TrendingUp, BarChart, Layers } from 'lucide-react'
import { Header } from '@/components/header'
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased">
      <Header showTryButton={true} />

      <main className="flex-1">
        {/* Hero Section - Better mobile spacing and font sizes */}
        <section className="relative py-12 md:py-24 min-h-[80vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center rounded-full px-3 md:px-4 py-1 text-xs md:text-sm font-medium bg-orange-100 text-orange-700">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  New: AI-Powered Arabic Content Generation
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Transform Product Content into{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500 block md:inline">
                  Sales Machines
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Generate SEO-optimized, culturally-aware product descriptions in Arabic and English. 
                Cut content creation time by 90% while boosting conversion rates.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600 px-8 h-12 text-base md:text-lg"
                  asChild
                >
                  <Link href="/generate">
                    Try Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 h-12 text-base md:text-lg"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </div>

            {/* Product Preview */}
            <motion.div 
              className="mt-20 rounded-xl border bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="aspect-[16/9] relative">
                <Image
                  src="/bulk-content-enrichment.png"
                  alt="Bulk Content Enrichment Interface"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-white via-orange-50/20 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-500 font-medium mb-4 inline-block">Features</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need for Perfect{' '}
                <span className="relative inline-block">
                  Product Content
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500 to-orange-500/0"></div>
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Purpose-built for e-commerce teams to create, optimize, and scale product content that converts.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
              {[
                {
                  icon: <Zap className="h-7 w-7" />,
                  title: "AI-Powered Generation",
                  description: "Create compelling product descriptions in seconds. Our AI understands your brand voice and product context.",
                  gradient: "from-amber-500/75 to-orange-500/75"
                },
                {
                  icon: <Globe2 className="h-7 w-7" />,
                  title: "Cultural Intelligence",
                  description: "Generate content that resonates with both Arabic and English audiences, respecting cultural nuances.",
                  gradient: "from-orange-500/75 to-red-500/75"
                },
                {
                  icon: <BarChart3 className="h-7 w-7" />,
                  title: "SEO & Conversion Focus",
                  description: "Every description is optimized for internal and external search engines and crafted to drive purchases.",
                  gradient: "from-red-500/75 to-orange-500/75"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative p-8 bg-white rounded-3xl border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-xl">
                    {/* Icon with gradient background */}
                    <div className="relative mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 flex items-center justify-center">
                        <div className="relative z-10 text-orange-600 group-hover:scale-110 transition-transform duration-500">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 rounded-2xl blur transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-orange-500 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover effect background */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                    
                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-[10%] right-[10%] h-0.5">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/50 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-500 font-medium mb-4 inline-block">Trusted by Leading Retailers</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join forward-thinking e-commerce teams already using Content Genie to scale their content operations.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  quote: "Content Genie has revolutionized our product content strategy. We've seen a 40% increase in organic traffic and significantly higher conversion rates.",
                  author: "Sarah Mitchell",
                  role: "E-commerce Director",
                  company: "Major Fashion Retailer",
                  avatar: "/sarah.png",
                  gradient: "from-orange-500/10 to-red-500/10"
                },
                {
                  quote: "The Arabic content generation is a game-changer. It's like having a local copywriter who understands our market perfectly. The SEO benefits also have been very good!",
                  author: "Mohammed Al-Rashid",
                  role: "Digital Marketing Head",
                  company: "Leading Department Store",
                  avatar: "/rashid.png",
                  gradient: "from-blue-500/10 to-orange-500/10"
                },
                {
                  quote: "We've cut our content creation time by 85% while improving quality. The ROI is incredible. The genration is very quick and reliable! The benefits are compelling.",
                  author: "James Chen",
                  role: "Product Content Manager",
                  company: "Global Retail Brand",
                  avatar: "/james.png",
                  gradient: "from-orange-500/10 to-amber-500/10"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500">
                    {/* Quote icon */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Quote text */}
                    <div className="mb-8">
                      <p className="text-gray-600 leading-relaxed relative">
                        {testimonial.quote}
                      </p>
                    </div>

                    {/* Author info with avatar */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-100">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                        <p className="text-sm text-orange-500">{testimonial.company}</p>
                      </div>
                    </div>

                    {/* Decorative gradient */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
                    
                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-[10%] right-[10%] h-0.5">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/50 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Content Genie Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative z-10 sticky top-20"
              >
                <span className="text-orange-500 font-medium mb-4 inline-block">Why Content Genie?</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Supercharge Your{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500">
                    Product Content
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      title: "10x Faster Content Creation",
                      description: "Transform hours of manual writing into minutes. Our AI generates high-quality product descriptions at scale, helping your team focus on strategic decisions.",
                      icon: <Clock className="h-5 w-5 text-orange-500" />,
                      gradient: "from-orange-500/20 to-orange-600/20"
                    },
                    {
                      title: "Dominate Search Rankings",
                      description: "Stand out in marketplace and Google searches with AI-optimized descriptions. Our technology understands search patterns and buyer psychology to maximize visibility.",
                      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
                      gradient: "from-blue-500/20 to-orange-500/20"
                    },
                    {
                      title: "Drive More Sales",
                      description: "Convert browsers into buyers with compelling product stories. Create persuasive content that highlights key benefits and triggers purchase decisions.",
                      icon: <BarChart className="h-5 w-5 text-orange-500" />,
                      gradient: "from-orange-600/20 to-red-500/20"
                    }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative"
                    >
                      <div className="relative p-6 bg-white rounded-3xl border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              {benefit.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-orange-500 transition-colors">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative md:-mt-12"
              >
                <div className="absolute -z-10 inset-0 transform translate-x-4 translate-y-4">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 to-blue-500/5" />
                </div>

                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative bg-white"
                >
                  <Image
                    src="/why-content-genie.jpg"
                    alt="Why choose Content Genie visualization"
                    width={500}
                    height={667}
                    className="object-cover w-full h-full"
                    priority
                  />
                  
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10"
                    animate={{
                      opacity: [0.2, 0.1, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -z-10 -bottom-8 -right-8 w-2/3 h-24 bg-gradient-to-r from-orange-100/30 to-blue-100/30 rounded-full blur-3xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange-500 font-medium mb-4 inline-block">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Three Steps to Better Product Content</h2>
              <p className="text-gray-600 text-lg">
                Get started in minutes with our streamlined process. No complex setup required.
              </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[
                  {
                    icon: <Upload className="h-8 w-8" />,
                    title: "Upload Product Data",
                    description: "Simply upload your product images and basic information. Support for bulk uploads and various file formats.",
                    color: "from-orange-500 to-orange-600"
                  },
                  {
                    icon: <Sparkles className="h-8 w-8" />,
                    title: "AI Magic",
                    description: "Our advanced AI analyzes your products and generates optimized, engaging content in seconds.",
                    color: "from-orange-400 to-orange-500"
                  },
                  {
                    icon: <Download className="h-8 w-8" />,
                    title: "Export & Use",
                    description: "Download your content in JSON or CSV format, or integrate directly with your e-commerce platform via API.",
                    color: "from-orange-500 to-orange-600"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Card */}
                    <div className="relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-orange-200">
                      {/* Step number */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <div className="mb-6 relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          {step.icon}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-500 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700" />
          
          {/* Dynamic particles effect */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-px"
                style={{
                  background: 'white',
                  top: `${(i * 5) % 100}%`,
                  left: `${(i * 7) % 100}%`,
                  filter: 'blur(1px)',
                }}
                animate={{
                  scale: [1, 15, 1],
                  opacity: [0, 0.2, 0],
                  filter: ['blur(1px)', 'blur(2px)', 'blur(1px)']
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Animated text streams */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute whitespace-nowrap text-white font-mono text-xs"
                initial={{ 
                  top: -100,
                  left: `${i * 10}%`,
                }}
                animate={{
                  top: '100%'
                }}
                transition={{
                  duration: 10 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "linear"
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j} className="my-2">
                    {`content${(i + j) % 6}`}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Animated gradient rings */}
          <div className="absolute inset-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  width: '600px',
                  height: '600px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 15 + i * 5,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Content wave effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Glowing dots */}
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${(i * 7) % 100}%`,
                  left: `${(i * 13) % 100}%`,
                  filter: 'blur(1px)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Rest of the content remains the same */}
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center space-y-8"
              >
                {/* Enhanced heading with animated underline */}
                <div className="relative inline-block">
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Ready to Transform Your{' '}
                    <span className="relative inline-block">
                      Product Content
                      <motion.div
                        className="absolute -bottom-2 left-0 w-full h-1 bg-white/50 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </span>
                    ?
                  </h2>
                </div>

                {/* Subheading with better contrast */}
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
                  Join industry leaders using Content Genie to create product descriptions that sell.{' '}
                  <span className="font-medium">Start now and experience the magic.</span>
                </p>

                {/* Enhanced CTA buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    size="lg" 
                    className="bg-white text-orange-500 hover:bg-orange-50 px-8 h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/generate" className="flex items-center gap-2">
                      <span className="relative z-10">Start Generating</span>
                      <motion.div
                        className="relative z-10"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-5 w-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Enhanced trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-white/90"
                >
                  {[
                    { icon: <Check className="h-5 w-5" />, text: "Quick & Reliable Results" },
                    { icon: <Check className="h-5 w-5" />, text: "Leverage Latest AI Models" },
                    { icon: <Check className="h-5 w-5" />, text: "Hassle Free Integration" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="rounded-full bg-white/10 p-1">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Additional decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>

        {/* Newsletter - Better mobile layout */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-white rounded-3xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto border border-orange-100/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Stay in the Loop
                  </h2>
                  <p className="text-gray-600 md:text-lg">
                    Get notified about new features, updates, and AI-powered content tips.
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <form className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Enter your work email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-colors"
                    />
                    <Button 
                      className="w-full bg-orange-500 text-white hover:bg-orange-600 h-12 rounded-xl"
                    >
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-3">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Join <span className="text-orange-500 font-semibold">2,000+</span> product content creators
                  </p>
                  <div className="flex items-center gap-6">
                    <Image 
                      src="/landmark-digital-logo.png" 
                      alt="Landmark Digital" 
                      width={100}
                      height={25}
                      className="opacity-90"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer - Better mobile grid */}
        <footer className="bg-white border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/generate" className="text-gray-600 hover:text-orange-500 transition-colors">Try Now</Link></li>
                  <li><Link href="#how-it-works" className="text-gray-600 hover:text-orange-500 transition-colors">How It Works</Link></li>
                  <li><Link href="#features" className="text-gray-600 hover:text-orange-500 transition-colors">Features</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="#faq" className="text-gray-600 hover:text-orange-500 transition-colors">FAQ</Link></li>
                  <li>
                    <a 
                      href="mailto:mohnish.bahal@landmarkgroup.com?subject=Content%20Genie%20Support" 
                      className="text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="mailto:mohnish.bahal@landmarkgroup.com" 
                      className="text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <div className="text-orange-500">⚡️</div>
                  </div>
                  <span className="font-semibold">Content Genie</span>
                </div>
                <p className="text-sm text-gray-600">
              © 2024 Content Genie. All rights reserved. For Landmark Group employees only.
            </p>
              </div>
            </div>
          </div>
        </footer>

        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-white text-orange-500 rounded-full shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-300 border border-orange-100"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </main>
    </div>
  )
}

