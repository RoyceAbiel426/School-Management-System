import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

/**
 * TwitterCard Component
 *
 * Manages Twitter Card meta tags for rich Twitter sharing.
 * Supports Summary, Summary with Large Image, App, and Player cards.
 *
 * Features:
 * - twitter:card, twitter:title, twitter:description
 * - twitter:image, twitter:image:alt
 * - twitter:site, twitter:creator
 * - App card metadata
 * - Player card metadata
 *
 * Card Types:
 * - summary: Default card with thumbnail image
 * - summary_large_image: Large image card
 * - app: Mobile app card
 * - player: Video/audio player card
 *
 * Usage:
 * <TwitterCard
 *   card="summary_large_image"
 *   title="Page Title"
 *   description="Page description"
 *   image="/images/twitter-card.jpg"
 *   site="@edupro"
 *   creator="@author"
 * />
 */

const TwitterCard = ({
  // Card Type
  card = "summary",

  // Basic Info
  title,
  description,
  image,
  imageAlt,

  // Twitter Accounts
  site,
  creator,

  // App Card
  app,

  // Player Card
  player,

  // Custom Twitter Tags
  customTwitterTags = [],
}) => {
  // Default site info
  const siteInfo = {
    baseUrl: import.meta.env.VITE_APP_URL || "https://edupro.com",
    defaultTitle: "Edu-Pro - School Management System",
    defaultDescription:
      "Comprehensive Learning Management System for schools. Manage students, teachers, courses, attendance, exams, library, and sports activities all in one platform.",
    defaultImage: "/images/twitter-card.jpg",
    defaultSite: "@edupro",
  };

  // Generate Twitter values
  const twitterTitle = title || siteInfo.defaultTitle;
  const twitterDescription = description || siteInfo.defaultDescription;
  const twitterSite = site || siteInfo.defaultSite;

  // Generate full image URL
  const twitterImage = image
    ? image.startsWith("http")
      ? image
      : `${siteInfo.baseUrl}${image}`
    : `${siteInfo.baseUrl}${siteInfo.defaultImage}`;

  return (
    <Helmet>
      {/* Card Type */}
      <meta name="twitter:card" content={card} />

      {/* Basic Info */}
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />

      {/* Image */}
      <meta name="twitter:image" content={twitterImage} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {/* Twitter Accounts */}
      <meta name="twitter:site" content={twitterSite} />
      {creator && <meta name="twitter:creator" content={creator} />}

      {/* App Card (for mobile apps) */}
      {card === "app" && app && (
        <>
          {/* iPhone App */}
          {app.iphone && (
            <>
              {app.iphone.name && (
                <meta
                  name="twitter:app:name:iphone"
                  content={app.iphone.name}
                />
              )}
              {app.iphone.id && (
                <meta name="twitter:app:id:iphone" content={app.iphone.id} />
              )}
              {app.iphone.url && (
                <meta name="twitter:app:url:iphone" content={app.iphone.url} />
              )}
            </>
          )}

          {/* iPad App */}
          {app.ipad && (
            <>
              {app.ipad.name && (
                <meta name="twitter:app:name:ipad" content={app.ipad.name} />
              )}
              {app.ipad.id && (
                <meta name="twitter:app:id:ipad" content={app.ipad.id} />
              )}
              {app.ipad.url && (
                <meta name="twitter:app:url:ipad" content={app.ipad.url} />
              )}
            </>
          )}

          {/* Google Play App */}
          {app.googlePlay && (
            <>
              {app.googlePlay.name && (
                <meta
                  name="twitter:app:name:googleplay"
                  content={app.googlePlay.name}
                />
              )}
              {app.googlePlay.id && (
                <meta
                  name="twitter:app:id:googleplay"
                  content={app.googlePlay.id}
                />
              )}
              {app.googlePlay.url && (
                <meta
                  name="twitter:app:url:googleplay"
                  content={app.googlePlay.url}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Player Card (for video/audio) */}
      {card === "player" && player && (
        <>
          {player.url && <meta name="twitter:player" content={player.url} />}
          {player.width && (
            <meta name="twitter:player:width" content={player.width} />
          )}
          {player.height && (
            <meta name="twitter:player:height" content={player.height} />
          )}
          {player.stream && (
            <meta name="twitter:player:stream" content={player.stream} />
          )}
          {player.streamContentType && (
            <meta
              name="twitter:player:stream:content_type"
              content={player.streamContentType}
            />
          )}
        </>
      )}

      {/* Custom Twitter Tags */}
      {customTwitterTags.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}
    </Helmet>
  );
};

TwitterCard.propTypes = {
  // Card Type
  card: PropTypes.oneOf(["summary", "summary_large_image", "app", "player"]),

  // Basic Info
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,

  // Twitter Accounts
  site: PropTypes.string,
  creator: PropTypes.string,

  // App Card
  app: PropTypes.shape({
    iphone: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      url: PropTypes.string,
    }),
    ipad: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      url: PropTypes.string,
    }),
    googlePlay: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      url: PropTypes.string,
    }),
  }),

  // Player Card
  player: PropTypes.shape({
    url: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    stream: PropTypes.string,
    streamContentType: PropTypes.string,
  }),

  // Custom
  customTwitterTags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
};

export default TwitterCard;
