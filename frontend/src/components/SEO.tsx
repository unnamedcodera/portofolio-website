import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  author?: string
}

const SEO: React.FC<SEOProps> = ({
  title = 'Darahitam Creative Lab | Professional Creative Agency & Design Studio',
  description = 'Darahitam Creative Lab transforms ideas into reality through innovative design, branding, web development, and creative solutions. Expert team specializing in visual identity, UI/UX design, digital marketing, and custom creative services for businesses worldwide.',
  keywords = 'creative agency, creative lab, darahitam, design studio, branding agency, web development, graphic design, digital marketing, UI/UX design, visual identity, logo design, brand strategy, creative solutions, professional design services, creative team, portfolio website, modern design, 2025 design trends',
  image = 'https://darahitam.com/img/DH.png',
  url = 'https://darahitam.com',
  type = 'website',
  author = 'Darahitam Creative Lab'
}) => {
  const fullTitle = title.includes('Darahitam') ? title : `${title} | Darahitam Creative Lab`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Darahitam Creative Lab" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={url} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Darahitam Creative Lab",
          "url": "https://darahitam.com",
          "logo": "https://darahitam.com/img/DH.png",
          "description": description,
          "slogan": "Transforming Ideas Into Reality",
          "foundingDate": "2020",
          "knowsAbout": ["Branding", "Web Development", "Graphic Design", "UI/UX Design", "Digital Marketing", "Creative Strategy"],
          "areaServed": "Worldwide",
          "serviceType": "Creative Agency Services",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "availableLanguage": ["English", "Indonesian"]
          },
          "sameAs": [
            // Add your social media links here
          ]
        })}
      </script>
      
      {/* Professional Service Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Darahitam Creative Lab",
          "image": "https://darahitam.com/img/DH.png",
          "url": "https://darahitam.com",
          "description": description,
          "priceRange": "$$",
          "serviceOutput": "Creative Solutions",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Creative Services",
            "itemListElement": [
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Branding & Identity Design"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Web Development"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Graphic Design"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "UI/UX Design"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Digital Marketing"}}
            ]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "50"
          }
        })}
      </script>
    </Helmet>
  )
}

export default SEO
