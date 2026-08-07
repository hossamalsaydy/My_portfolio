/**
 * SEO & Structured Data Management
 * This script dynamically generates JSON-LD for Google and updates SEO tags based on portfolio data.
 */

document.addEventListener('DOMContentLoaded', () => {
    updateSEO();
});

function updateSEO() {
    const data = loadData();
    if (!data) return;

    // 1. Generate Structured Data (JSON-LD)
    generateStructuredData(data);

    // 2. Update dynamic keywords based on projects and skills
    updateKeywords(data);
}

function generateStructuredData(data) {
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Person Schema
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.about.name,
        "jobTitle": "Software Engineer",
        "url": baseUrl,
        "image": baseUrl + data.about.image,
        "telephone": "+967778470907",
        "sameAs": [
            "https://github.com/hossamalsaydy",
            "https://wa.me/967778470907"
        ],
        "description": data.about.title
    };

    // Projects as SoftwareApplication
    const projectsSchema = data.projects.map(proj => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": proj.name,
        "description": proj.description,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "author": {
            "@type": "Person",
            "name": data.about.name
        },
        "url": proj.link,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }));

    // Services (Skills)
    const skillsSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Software Development",
        "provider": {
            "@type": "Person",
            "name": data.about.name
        },
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Software Services",
            "itemListElement": data.skills.map((skill, index) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": skill.name,
                    "description": skill.description
                }
            }))
        }
    };

    // Combine all schemas
    const combinedSchema = [personSchema, ...projectsSchema, skillsSchema];

    // Inject into head
    let scriptTag = document.getElementById('structured-data');
    if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(combinedSchema);
}

function updateKeywords(data) {
    const projectNames = data.projects.map(p => p.name).join(', ');
    const skillNames = data.skills.map(s => s.name).join(', ');
    const extraKeywords = `${projectNames}, ${skillNames}, مبرمج يمني, 778470907`;
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        const originalKeywords = metaKeywords.getAttribute('content');
        metaKeywords.setAttribute('content', originalKeywords + ', ' + extraKeywords);
    }
}

// Global function to be called from admin.js after saving data
window.refreshSEO = function() {
    updateSEO();
};
