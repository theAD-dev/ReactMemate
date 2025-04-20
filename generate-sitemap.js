const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

const baseUrl = "https://app.memate.com.au";

const staticRoutes = [
    "/",
    "/login",
    "/onboarding",
    "/requestdemo",
    "/work/dashboard"
];

async function generateSitemap() {
    const sitemap = new SitemapStream({ hostname: baseUrl });
    const pipeline = sitemap.pipe(createGzip());

    staticRoutes.forEach(route => {
        sitemap.write({ url: route, changefreq: "monthly", priority: 0.7 });
    });

    sitemap.end();

    const data = await streamToPromise(pipeline);
    fs.writeFileSync("./public/sitemap.xml.gz", data);
    console.log("✅ Sitemap generated and saved to /public/sitemap.xml.gz");
}

generateSitemap();
