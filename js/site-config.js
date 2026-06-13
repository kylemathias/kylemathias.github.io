// Site configuration
const siteConfig = {
    // Pages configuration
    pages: [
        {
            id: 'home',
            title: 'Kyle Mathias',
            path: 'index.html',
            showInNav: true
        },
        {
            id: 'resume',
            title: 'Resume',
            path: 'resume.html',
            showInNav: true
        },
        {
            id: 'contact',
            title: 'Contact',
            path: 'contact.html',
            showInNav: true
        },
        {
            id: 'projects',
            title: 'Projects',
            path: 'projects.html',
            showInNav: true
        }
    ],

    // site-brand:generated-start
    brand: {
        name: "Kyle Mathias",
        titleLine: "Marketing Technology Solutions Architect",
        taglineLine: "Integrations · iPaaS · MarTech",
        titleFull: "Marketing Technology Solutions Architect | Integrations · iPaaS · MarTech",
        metaDescription: "Kyle Mathias is a Marketing Technology Solutions Architect connecting marketing platforms, automating workflows, and onboarding enterprise MarTech stacks. Core focus: Integrations · iPaaS · MarTech.",
        metaKeywords: "Kyle Mathias, Marketing Technology Solutions Architect, MarTech, Integrations, iPaaS, Tray.io, Marketo, SFDC, portfolio, resume, contact",
        shareImageAlt: "Kyle Mathias - Marketing Technology Solutions Architect | Integrations · iPaaS · MarTech",
        siteUrl: "https://kylemathias.com",
        shareImage: "https://kylemathias.com/assets/shareimage.jpg"
    }
    // site-brand:generated-end

    // Get all pages that should appear in navigation
    getNavPages: function() {
        return this.pages.filter(page => page.showInNav);
    },

    // Get page by ID
    getPage: function(id) {
        return this.pages.find(page => page.id === id);
    },

    // Get current page based on URL
    getCurrentPage: function() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        return this.pages.find(page => page.path === path) || this.pages[0];
    }
};