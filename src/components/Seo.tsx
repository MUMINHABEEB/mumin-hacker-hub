import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

// The static tags in index.html stay for non-JS crawlers, but once Helmet
// renders the per-route tags we drop the static duplicates from the DOM.
const STATIC_DUPLICATES = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
];

function removeStaticDuplicates() {
  STATIC_DUPLICATES.forEach((selector) => {
    document
      .querySelectorAll(`${selector}:not([data-rh])`)
      .forEach((el) => el.remove());
  });
}

export const SITE_URL = "https://mumin-hacker-hub.lovable.app";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const Seo = ({ title, description, path, type = "website", jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    removeStaticDuplicates();
  }, [title, description, path]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
