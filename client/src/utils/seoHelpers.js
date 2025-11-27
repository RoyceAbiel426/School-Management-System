/**
 * SEO Helper Functions
 *
 * Utility functions for SEO management including meta tag generation,
 * canonical URLs, breadcrumbs, sitemap generation, and more.
 */

const siteInfo = {
  baseUrl: import.meta.env.VITE_APP_URL || "https://edupro.com",
  siteName: "Edu-Pro LMS",
  defaultTitle: "Edu-Pro - School Management System",
  defaultDescription:
    "Comprehensive Learning Management System for schools. Manage students, teachers, courses, attendance, exams, library, and sports activities all in one platform.",
  defaultKeywords:
    "school management system, LMS, learning management, education software, student management, teacher management, attendance system, exam management",
  twitterHandle: "@edupro",
  logo: "/images/logo.png",
  ogImage: "/images/og-default.jpg",
  twitterImage: "/images/twitter-card.jpg",
};

/**
 * Generate page title
 * @param {string} pageTitle - Page-specific title
 * @param {boolean} appendSiteName - Whether to append site name
 * @returns {string} Full page title
 */
export const generateTitle = (pageTitle, appendSiteName = true) => {
  if (!pageTitle) {
    return siteInfo.defaultTitle;
  }

  return appendSiteName ? `${pageTitle} | ${siteInfo.siteName}` : pageTitle;
};

/**
 * Generate meta description
 * @param {string} description - Page-specific description
 * @param {number} maxLength - Maximum length (default 160)
 * @returns {string} Truncated description
 */
export const generateDescription = (description, maxLength = 160) => {
  const desc = description || siteInfo.defaultDescription;

  if (desc.length <= maxLength) {
    return desc;
  }

  return desc.substring(0, maxLength - 3) + "...";
};

/**
 * Generate canonical URL
 * @param {string} path - Page path
 * @returns {string} Full canonical URL
 */
export const generateCanonicalUrl = (path) => {
  // Remove trailing slash
  const cleanPath = path.replace(/\/$/, "");

  // Remove leading slash if present
  const pathWithoutSlash = cleanPath.startsWith("/")
    ? cleanPath.substring(1)
    : cleanPath;

  return pathWithoutSlash
    ? `${siteInfo.baseUrl}/${pathWithoutSlash}`
    : siteInfo.baseUrl;
};

/**
 * Generate image URL
 * @param {string} imagePath - Image path or URL
 * @param {string} fallback - Fallback image path
 * @returns {string} Full image URL
 */
export const generateImageUrl = (imagePath, fallback = siteInfo.ogImage) => {
  if (!imagePath) {
    return `${siteInfo.baseUrl}${fallback}`;
  }

  // If already full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Otherwise, prepend base URL
  return `${siteInfo.baseUrl}${imagePath}`;
};

/**
 * Generate keywords string
 * @param {Array|string} keywords - Array of keywords or comma-separated string
 * @returns {string} Comma-separated keywords
 */
export const generateKeywords = (keywords) => {
  if (!keywords) {
    return siteInfo.defaultKeywords;
  }

  if (Array.isArray(keywords)) {
    return keywords.join(", ");
  }

  return keywords;
};

/**
 * Generate breadcrumb data
 * @param {Array} items - Array of breadcrumb items [{name, url}]
 * @returns {Object} Breadcrumb structured data
 */
export const generateBreadcrumbs = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: generateCanonicalUrl(item.url),
    })),
  };
};

/**
 * Page-specific SEO configurations
 */
export const pageSEO = {
  home: {
    title: "Home",
    description:
      "Edu-Pro - Comprehensive school management system for modern educational institutions.",
    keywords: "school management, LMS, education platform, student management",
    canonical: "/",
  },

  login: {
    title: "Login",
    description:
      "Login to Edu-Pro LMS to access your dashboard and manage your school.",
    keywords: "login, sign in, access, authentication",
    canonical: "/login",
    robots: "noindex, nofollow",
  },

  adminDashboard: {
    title: "Admin Dashboard",
    description:
      "Manage your school with powerful admin tools. View statistics, manage users, and oversee all operations.",
    keywords: "admin dashboard, school management, administration, analytics",
    canonical: "/admin/dashboard",
    robots: "noindex, nofollow",
  },

  studentDashboard: {
    title: "Student Dashboard",
    description:
      "Access your courses, view attendance, check results, and manage your academic profile.",
    keywords: "student dashboard, courses, attendance, results, grades",
    canonical: "/student/dashboard",
    robots: "noindex, nofollow",
  },

  teacherDashboard: {
    title: "Teacher Dashboard",
    description:
      "Manage your classes, mark attendance, enter results, and track student progress.",
    keywords: "teacher dashboard, class management, attendance, results entry",
    canonical: "/teacher/dashboard",
    robots: "noindex, nofollow",
  },

  coachDashboard: {
    title: "Coach Dashboard",
    description:
      "Manage sports activities, participants, events, and track performance.",
    keywords:
      "coach dashboard, sports management, events, performance tracking",
    canonical: "/coach/dashboard",
    robots: "noindex, nofollow",
  },

  librarianDashboard: {
    title: "Librarian Dashboard",
    description:
      "Manage library catalog, issue books, track transactions, and view analytics.",
    keywords:
      "librarian dashboard, library management, book catalog, transactions",
    canonical: "/librarian/dashboard",
    robots: "noindex, nofollow",
  },

  notFound: {
    title: "404 - Page Not Found",
    description: "The page you are looking for could not be found.",
    keywords: "404, page not found, error",
    canonical: "/404",
    robots: "noindex, nofollow",
  },
};

/**
 * Get SEO config for a specific page
 * @param {string} pageName - Name of the page
 * @returns {Object} SEO configuration
 */
export const getPageSEO = (pageName) => {
  return (
    pageSEO[pageName] || {
      title: "",
      description: siteInfo.defaultDescription,
      keywords: siteInfo.defaultKeywords,
      canonical: "/",
    }
  );
};

/**
 * Generate sitemap items
 * @returns {Array} Array of sitemap items
 */
export const generateSitemapItems = () => {
  return [
    // Public pages
    {
      url: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/login",
      changefreq: "monthly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/admin/login",
      changefreq: "monthly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/student/register",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    {
      url: "/admin/register",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    // Error pages
    {
      url: "/404",
      changefreq: "yearly",
      priority: 0.1,
      lastmod: new Date().toISOString(),
    },
  ];
};

/**
 * Generate robots.txt content
 * @returns {string} robots.txt content
 */
export const generateRobotsTxt = () => {
  const sitemap = `${siteInfo.baseUrl}/sitemap.xml`;

  return `# Edu-Pro LMS - Robots.txt
# Generated on ${new Date().toISOString()}

# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin, dashboard, and authenticated pages
Disallow: /admin/
Disallow: /student/dashboard
Disallow: /teacher/dashboard
Disallow: /coach/dashboard
Disallow: /librarian/dashboard
Disallow: /api/

# Disallow error pages
Disallow: /404
Disallow: /401
Disallow: /500
Disallow: /offline

# Sitemap location
Sitemap: ${sitemap}
`;
};

/**
 * Generate sitemap.xml content
 * @param {Array} items - Array of sitemap items
 * @returns {string} sitemap.xml content
 */
export const generateSitemapXml = (items = generateSitemapItems()) => {
  const xmlItems = items
    .map(
      (item) => `
  <url>
    <loc>${siteInfo.baseUrl}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
};

/**
 * Default organization structured data
 */
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteInfo.siteName,
  url: siteInfo.baseUrl,
  logo: generateImageUrl(siteInfo.logo),
  description: siteInfo.defaultDescription,
  sameAs: [
    "https://twitter.com/edupro",
    "https://www.facebook.com/edupro",
    "https://www.linkedin.com/company/edupro",
  ],
};

/**
 * Default website structured data
 */
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteInfo.siteName,
  url: siteInfo.baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteInfo.baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default {
  generateTitle,
  generateDescription,
  generateCanonicalUrl,
  generateImageUrl,
  generateKeywords,
  generateBreadcrumbs,
  getPageSEO,
  generateSitemapItems,
  generateRobotsTxt,
  generateSitemapXml,
  organizationStructuredData,
  websiteStructuredData,
  siteInfo,
};
