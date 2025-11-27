import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

/**
 * StructuredData Component
 *
 * Adds JSON-LD structured data for rich search results.
 * Helps search engines understand your content better.
 *
 * Supported Schema Types:
 * - Organization
 * - EducationalOrganization
 * - Course
 * - Person
 * - Article
 * - BreadcrumbList
 * - FAQPage
 * - Website
 *
 * Usage:
 * <StructuredData type="organization" data={organizationData} />
 * <StructuredData type="course" data={courseData} />
 */

const StructuredData = ({ type, data, customData }) => {
  const siteInfo = {
    baseUrl: import.meta.env.VITE_APP_URL || "https://edupro.com",
    siteName: "Edu-Pro LMS",
    logo: "/images/logo.png",
  };

  // Generate schema based on type
  const generateSchema = () => {
    if (customData) {
      return customData;
    }

    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: data.name || siteInfo.siteName,
          url: data.url || siteInfo.baseUrl,
          logo: data.logo || `${siteInfo.baseUrl}${siteInfo.logo}`,
          description: data.description,
          address: data.address && {
            "@type": "PostalAddress",
            streetAddress: data.address.street,
            addressLocality: data.address.city,
            addressRegion: data.address.state,
            postalCode: data.address.zip,
            addressCountry: data.address.country,
          },
          contactPoint: data.contactPoint && {
            "@type": "ContactPoint",
            telephone: data.contactPoint.phone,
            contactType: data.contactPoint.type || "Customer Service",
            email: data.contactPoint.email,
          },
          sameAs: data.socialProfiles || [],
        };

      case "educationalOrganization":
        return {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: data.name || siteInfo.siteName,
          url: data.url || siteInfo.baseUrl,
          logo: data.logo || `${siteInfo.baseUrl}${siteInfo.logo}`,
          description: data.description,
          address: data.address && {
            "@type": "PostalAddress",
            streetAddress: data.address.street,
            addressLocality: data.address.city,
            addressRegion: data.address.state,
            postalCode: data.address.zip,
            addressCountry: data.address.country,
          },
          telephone: data.phone,
          email: data.email,
        };

      case "course":
        return {
          "@context": "https://schema.org",
          "@type": "Course",
          name: data.name,
          description: data.description,
          provider: {
            "@type": "Organization",
            name: data.provider || siteInfo.siteName,
            sameAs: data.providerUrl || siteInfo.baseUrl,
          },
          courseCode: data.code,
          hasCourseInstance:
            data.instances &&
            data.instances.map((instance) => ({
              "@type": "CourseInstance",
              courseMode: instance.mode || "online",
              startDate: instance.startDate,
              endDate: instance.endDate,
              instructor: instance.instructor && {
                "@type": "Person",
                name: instance.instructor.name,
              },
            })),
        };

      case "person":
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          name: data.name,
          jobTitle: data.jobTitle,
          email: data.email,
          telephone: data.phone,
          url: data.url,
          image: data.image,
          worksFor: data.organization && {
            "@type": "Organization",
            name: data.organization,
          },
        };

      case "article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.headline,
          description: data.description,
          image: data.image,
          author: {
            "@type": "Person",
            name: data.author,
          },
          publisher: {
            "@type": "Organization",
            name: data.publisher || siteInfo.siteName,
            logo: {
              "@type": "ImageObject",
              url: `${siteInfo.baseUrl}${siteInfo.logo}`,
            },
          },
          datePublished: data.publishedDate,
          dateModified: data.modifiedDate,
        };

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${siteInfo.baseUrl}${item.url}`,
          })),
        };

      case "faq":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        };

      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: data.name || siteInfo.siteName,
          url: data.url || siteInfo.baseUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteInfo.baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) {
    return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

StructuredData.propTypes = {
  type: PropTypes.oneOf([
    "organization",
    "educationalOrganization",
    "course",
    "person",
    "article",
    "breadcrumb",
    "faq",
    "website",
  ]),
  data: PropTypes.object,
  customData: PropTypes.object,
};

export default StructuredData;
