// SEO Analytics Helper - Lightweight tracking for SEO insights
class SEOAnalytics {
    constructor() {
        this.startTime = Date.now();
        this.interactions = [];
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Track Core Web Vitals for SEO
        this.trackCoreWebVitals();
        
        // Track user engagement metrics
        this.trackEngagement();
        
        // Track PWA installation prompts
        this.trackPWAInstall();
        
        this.initialized = true;
    }

    trackCoreWebVitals() {
        // Track Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.sendMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Track First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.sendMetric('FID', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.sendMetric('CLS', clsValue);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackEngagement() {
        // Track time to first game start
        document.addEventListener('gameStarted', () => {
            const timeToStart = Date.now() - this.startTime;
            this.sendMetric('timeToGameStart', timeToStart);
        });

        // Track total session time
        window.addEventListener('beforeunload', () => {
            const sessionTime = Date.now() - this.startTime;
            this.sendMetric('sessionDuration', sessionTime);
        });

        // Track game completions
        document.addEventListener('gameCompleted', () => {
            this.sendMetric('gameCompletion', 1);
        });
    }

    trackPWAInstall() {
        // Track PWA install prompts
        window.addEventListener('beforeinstallprompt', (e) => {
            this.sendMetric('pwaPromptShown', 1);
        });

        // Track actual PWA installations
        window.addEventListener('appinstalled', () => {
            this.sendMetric('pwaInstalled', 1);
        });
    }

    sendMetric(name, value) {
        // In a real implementation, send to your analytics service
        console.log(`SEO Metric: ${name} = ${value}`);
        
        // Store locally for debugging
        const metrics = JSON.parse(localStorage.getItem('seoMetrics') || '{}');
        metrics[name] = value;
        localStorage.setItem('seoMetrics', JSON.stringify(metrics));
    }

    // Get SEO performance summary
    getSEOSummary() {
        const metrics = JSON.parse(localStorage.getItem('seoMetrics') || '{}');
        return {
            coreWebVitals: {
                lcp: metrics.LCP || 'Not measured',
                fid: metrics.FID || 'Not measured', 
                cls: metrics.CLS || 'Not measured'
            },
            engagement: {
                timeToGameStart: metrics.timeToGameStart || 'Not measured',
                sessionDuration: metrics.sessionDuration || 'In progress',
                gameCompletions: metrics.gameCompletion || 0
            },
            pwa: {
                promptsShown: metrics.pwaPromptShown || 0,
                installations: metrics.pwaInstalled || 0
            }
        };
    }
}

// Initialize SEO Analytics
const seoAnalytics = new SEOAnalytics();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => seoAnalytics.init());
} else {
    seoAnalytics.init();
}

// Make available globally for debugging
window.seoAnalytics = seoAnalytics; 