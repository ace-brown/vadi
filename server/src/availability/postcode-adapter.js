// Estimate without a provider API: every connection type the provider offers in
// this postcode area, at the speed of its fastest offer. The provider confirms
// the exact address when the customer orders.
async function check(address, provider, offers) {
    const byType = {};
    offers
        .filter((offer) => offer.coverage?.nationwide !== false
            || (offer.coverage?.postcodePrefixes ?? []).some((prefix) => address.postcode.startsWith(prefix)))
        .forEach((offer) => {
            byType[offer.connectionType] = Math.max(byType[offer.connectionType] ?? 0, offer.downloadMbps);
        });
    return Object.entries(byType).map(([connectionType, maxDownloadMbps]) => ({ connectionType, maxDownloadMbps }));
}

module.exports = { source: 'postcode', check };
