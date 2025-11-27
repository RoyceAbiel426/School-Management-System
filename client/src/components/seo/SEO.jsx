import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

/**
 * SEO Component
 *
 * Manages meta tags for SEO optimization using react-helmet-async.
 * Supports dynamic page-specific meta data including title, description, keywords,
 * canonical URL, robots directives, and more.
 *
 * Features:
 * - Dynamic title management
 * - Meta description and keywords
 * - Canonical URL
 * - Robots meta tags
 * - Language and locale
 * - Author and publisher info
 * - Viewport and mobile optimization
 *
 * Usage:
 * <SEO
 *   title="Page Title"
 *   description="Page description"
 *   keywords="keyword1, keyword2"
 *   canonical="/current-page"
 * />
 */

const SEO = ({
  // Basic Meta
  title,
  description,
  keywords,
  author,

  // URLs
  canonical,

  // Robots
  robots,
  googlebot,

  // Language & Locale
  lang,
  locale,

  // Additional Meta
  viewport,
  themeColor,
  appleMobileWebAppCapable,
  appleMobileWebAppStatusBarStyle,
  appleMobileWebAppTitle,

  // Structured Data (JSON-LD)
  jsonLd,

  // Custom Meta Tags
  customMeta = [],

  // Custom Link Tags
  customLink = [],
}) => {
  // Default site info
  const siteInfo = {
    siteName: "Edu-Pro LMS",
    baseUrl: import.meta.env.VITE_APP_URL || "https://edupro.com",
    defaultTitle: "Edu-Pro - School Management System",
    defaultDescription:
      "Comprehensive Learning Management System for schools. Manage students, teachers, courses, attendance, exams, library, and sports activities all in one platform.",
    defaultKeywords:
      "school management system, LMS, learning management, education software, student management, teacher management, attendance system, exam management",
    defaultAuthor: "Edu-Pro Team",
    twitterHandle: "@edupro",
  };

  // Generate full title
  const fullTitle = title
    ? `${title} | ${siteInfo.siteName}`
    : siteInfo.defaultTitle;

  // Generate canonical URL
  const canonicalUrl = canonical
    ? `${siteInfo.baseUrl}${canonical}`
    : siteInfo.baseUrl;

  // Generate description
  const metaDescription = description || siteInfo.defaultDescription;

  // Generate keywords
  const metaKeywords = keywords || siteInfo.defaultKeywords;

  // Generate author
  const metaAuthor = author || siteInfo.defaultAuthor;

  // Generate robots
  const metaRobots = robots || "index, follow";

  // Generate language
  const metaLang = lang || "en";

  // Generate locale
  const metaLocale = locale || "en_US";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={metaLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={metaAuthor} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Meta */}
      <meta name="robots" content={metaRobots} />
      {googlebot && <meta name="googlebot" content={googlebot} />}

      {/* Language & Locale */}
      <meta httpEquiv="content-language" content={metaLang} />
      <meta property="og:locale" content={metaLocale} />

      {/* Viewport (if custom provided) */}
      {viewport && <meta name="viewport" content={viewport} />}

      {/* Theme Color (if provided) */}
      {themeColor && <meta name="theme-color" content={themeColor} />}

      {/* Apple Mobile Web App Meta */}
      {appleMobileWebAppCapable && (
        <meta
          name="apple-mobile-web-app-capable"
          content={appleMobileWebAppCapable}
        />
      )}
      {appleMobileWebAppStatusBarStyle && (
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={appleMobileWebAppStatusBarStyle}
        />
      )}
      {appleMobileWebAppTitle && (
        <meta
          name="apple-mobile-web-app-title"
          content={appleMobileWebAppTitle}
        />
      )}

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />

      {/* Application Meta */}
      <meta name="application-name" content={siteInfo.siteName} />
      <meta name="apple-mobile-web-app-title" content={siteInfo.siteName} />

      {/* Referrer Policy */}
      <meta name="referrer" content="origin-when-cross-origin" />

      {/* Custom Meta Tags */}
      {customMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}

      {/* Custom Link Tags */}
      {customLink.map((link, index) => (
        <link key={index} {...link} />
      ))}

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  // Basic Meta
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,

  // URLs
  canonical: PropTypes.string,

  // Robots
  robots: PropTypes.string,
  googlebot: PropTypes.string,

  // Language & Locale
  lang: PropTypes.string,
  locale: PropTypes.string,

  // Additional Meta
  viewport: PropTypes.string,
  themeColor: PropTypes.string,
  appleMobileWebAppCapable: PropTypes.string,
  appleMobileWebAppStatusBarStyle: PropTypes.string,
  appleMobileWebAppTitle: PropTypes.string,

  // Structured Data
  jsonLd: PropTypes.object,

  // Custom Tags
  customMeta: PropTypes.arrayOf(PropTypes.object),
  customLink: PropTypes.arrayOf(PropTypes.object),
};

export default SEO;
