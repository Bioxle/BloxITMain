const CONFIG = {
    studioName: "BloxIT",
    tagline: "Your ideas, brought online.",
    description: "We design and build clean, modern websites for developers, creators, and Roblox projects. Our focus is on performance, simplicity, and visuals that make your project stand out.",
    contactEmail: "contact@bloxit.com",
    socials: {
        discord: "https://discord.gg/WpBTdtqK86",
    },
    services: [
        {
            id: "basic",
            title: "Basic Website",
            price: "$15–$30",
            description: "A professional 1-3 page website. Perfect for individual portfolios or small projects.",
            icon: "🌱"
        },
        {
            id: "standard",
            title: "Standard Website",
            price: "$30–$70",
            description: "Fully responsive multi-page site with advanced styling, animations, and custom UI.",
            icon: "🚀",
            popular: true
        },
        {
            id: "advanced",
            title: "Advanced Website",
            price: "$70–$150+",
            description: "Large-scale marketplaces, hubs, or complex web apps with full back-end integration.",
            icon: "💎"
        }
    ],
    portfolio: [
        {
            title: "AssetShop example",
            category: "Shop",
            image: "assets/portfolio1/photo1.png",
            link: "#",
            fullDescription: "This is just a example we made. Your order will be custom just for you! with your own design details and features!",
            media: [
                { type: "image", src: "assets/portfolio1/image.png" },
                { type: "image", src: "assets/portfolio1/photo1.png" },
                { type: "video", src: "assets/portfolio1/Assetshop.mp4" }
            ]
        },
        {
            title: "Vibe Journal",
            category: "AI",
            image: "assets/portfolio2/image1.png",
            link: "#",
            fullDescription: "Vibe Journal is an AI-powered journaling app that helps you track your mood and habits. This showcases our ability to integrate AI into your projects!",
            media: [
                { type: "video", src: "assets/portfolio2/AI.mp4" }
            ]
        },
        {
            title: "Portfolio Site",
            category: "Portfolio",
            image: "assets/portfolio3/image1.png",
            link: "#",
            fullDescription: "A portfolio template site we made for a Roblox developer. This is just an example! We can make anything you want, with your own design details and features!",
            media: [
                { type: "video", src: "assets/portfolio3/video.mp4" }
            ]
        }
    ]
};

// Expose globally for main.js when opened via file://
window.CONFIG = CONFIG;
