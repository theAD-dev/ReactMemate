export async function submitHubspotForm(fields) {
    const portalId = '241966069';
    const formId = '39ad4b7b-9757-48e2-97d1-ac46aa95862c';

    if (!portalId || !formId) {
        console.error("❌ HubSpot portalId or formId is missing");
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
