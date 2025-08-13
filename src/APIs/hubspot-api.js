export async function submitHubspotForm(fields) {
    const portalId = process.env.REACT_APP_HUBSPOT_PORTAL_ID;
    const formId = process.env.REACT_APP_HUBSPOT_FORM_ID;

    if (!portalId || !formId) {
        console.error("❌ HubSpot portalId or formId is missing in .env");
        return;
    }

    try {
        const res = await fetch(
            `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
                    context: {
                        pageUri: window.location.href,
                        pageName: document.title
                    }
                })
            }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("❌ HubSpot submission failed:", err);
    }
}
