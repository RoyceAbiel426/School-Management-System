import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

/**
 * OpenGraph Component
 *
 * Manages Open Graph meta tags for rich social media sharing.
 * Used by Facebook, LinkedIn, Pinterest, and other platforms.
 *
 * Features:
 * - og:title, og:description, og:image
 * - og:url, og:type, og:site_name
 * - og:locale, og:locale:alternate
 * - Article metadata
 * - Profile metadata
 * - Image dimensions and alt text
 *
 * Usage:
 * <OpenGraph
 *   title="Page Title"
 *   description="Page description"
 *   image="/images/og-image.jpg"
 *   url="/current-page"
 *   type="website"
 * />
 */

const OpenGraph = ({
  // Basic OG Tags
  title,
  description,
  image,
  url,
  type = "website",
  siteName,

  // Locale
  locale,
  localeAlternate,

  // Image Details
  imageWidth,
  imageHeight,
  imageAlt,
  imageType,
  imageSecureUrl,

  // Article Meta (for blog posts, news)
  article,

  // Profile Meta (for user profiles)
  profile,

  // Video Meta
  video,

  // Custom OG Tags
  customOgTags = [],
}) => {
  // Default site info
  const siteInfo = {
    siteName: "Edu-Pro LMS",
    baseUrl: import.meta.env.VITE_APP_URL || "https://edupro.com",
    defaultTitle: "Edu-Pro - School Management System",
    defaultDescription:
      "Comprehensive Learning Management System for schools. Manage students, teachers, courses, attendance, exams, library, and sports activities all in one platform.",
    defaultImage: "/images/og-default.jpg",
    defaultLocale: "en_US",
  };

  // Generate OG values
  const ogTitle = title || siteInfo.defaultTitle;
  const ogDescription = description || siteInfo.defaultDescription;
  const ogSiteName = siteName || siteInfo.siteName;
  const ogLocale = locale || siteInfo.defaultLocale;

  // Generate full URL
  const ogUrl = url ? `${siteInfo.baseUrl}${url}` : siteInfo.baseUrl;

  // Generate full image URL
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteInfo.baseUrl}${image}`
    : `${siteInfo.baseUrl}${siteInfo.defaultImage}`;

  // Generate secure image URL (https)
  const ogImageSecure =
    imageSecureUrl || ogImage.replace("http://", "https://");

  return (
    <Helmet>
      {/* Basic Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={ogSiteName} />

      {/* Locale */}
      <meta property="og:locale" content={ogLocale} />
      {localeAlternate &&
        localeAlternate.map((alt, index) => (
          <meta key={index} property="og:locale:alternate" content={alt} />
        ))}

      {/* Image Details */}
      {imageWidth && <meta property="og:image:width" content={imageWidth} />}
      {imageHeight && <meta property="og:image:height" content={imageHeight} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {imageType && <meta property="og:image:type" content={imageType} />}
      {ogImageSecure !== ogImage && (
        <meta property="og:image:secure_url" content={ogImageSecure} />
      )}

      {/* Article Metadata (for blog posts, news articles) */}
      {type === "article" && article && (
        <>
          {article.publishedTime && (
            <meta
              property="article:published_time"
              content={article.publishedTime}
            />
          )}
          {article.modifiedTime && (
            <meta
              property="article:modified_time"
              content={article.modifiedTime}
            />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags &&
            article.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          {article.expirationTime && (
            <meta
              property="article:expiration_time"
              content={article.expirationTime}
            />
          )}
        </>
      )}

      {/* Profile Metadata (for user profiles) */}
      {type === "profile" && profile && (
        <>
          {profile.firstName && (
            <meta property="profile:first_name" content={profile.firstName} />
          )}
          {profile.lastName && (
            <meta property="profile:last_name" content={profile.lastName} />
          )}
          {profile.username && (
            <meta property="profile:username" content={profile.username} />
          )}
          {profile.gender && (
            <meta property="profile:gender" content={profile.gender} />
          )}
        </>
      )}

      {/* Video Metadata */}
      {video && (
        <>
          {video.url && <meta property="og:video" content={video.url} />}
          {video.secureUrl && (
            <meta property="og:video:secure_url" content={video.secureUrl} />
          )}
          {video.type && <meta property="og:video:type" content={video.type} />}
          {video.width && (
            <meta property="og:video:width" content={video.width} />
          )}
          {video.height && (
            <meta property="og:video:height" content={video.height} />
          )}
        </>
      )}

      {/* Custom OG Tags */}
      {customOgTags.map((tag, index) => (
        <meta key={index} property={tag.property} content={tag.content} />
      ))}
    </Helmet>
  );
};

OpenGraph.propTypes = {
  // Basic
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf([
    "website",
    "article",
    "profile",
    "video",
    "book",
    "music.song",
    "music.album",
    "music.playlist",
    "video.movie",
    "video.episode",
    "video.tv_show",
    "video.other",
  ]),
  siteName: PropTypes.string,

  // Locale
  locale: PropTypes.string,
  localeAlternate: PropTypes.arrayOf(PropTypes.string),

  // Image Details
  imageWidth: PropTypes.string,
  imageHeight: PropTypes.string,
  imageAlt: PropTypes.string,
  imageType: PropTypes.string,
  imageSecureUrl: PropTypes.string,

  // Article
  article: PropTypes.shape({
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    author: PropTypes.string,
    section: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    expirationTime: PropTypes.string,
  }),

  // Profile
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    gender: PropTypes.string,
  }),

  // Video
  video: PropTypes.shape({
    url: PropTypes.string,
    secureUrl: PropTypes.string,
    type: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
  }),

  // Custom
  customOgTags: PropTypes.arrayOf(
    PropTypes.shape({
      property: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
};

export default OpenGraph;
