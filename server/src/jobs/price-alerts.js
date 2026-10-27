const PriceAlert = require('../models/price-alert');
const HomeTariff = require('../models/internet/home-tariff');
const MobileTariff = require('../models/internet/mobile-tariff');
const { activeOfferFilter } = require('../models/schemas/offer-schema');
const { sendMail } = require('../mailer');

const MODELS = { home: HomeTariff, mobile: MobileTariff };
const PATHS = { home: 'home-tariff', mobile: 'mobile-tariff' };

function formatEuro(value, language) {
    return new Intl.NumberFormat(language === 'en' ? 'en-IE' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function alertMail(user, offer, alert) {
    const language = user.settings?.language === 'en' ? 'en' : 'de';
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const link = `${clientUrl}/internet/${PATHS[alert.offerType]}/${offer._id}`;
    const name = `${offer.provider} ${offer.name}`;
    const price = formatEuro(offer.effectiveMonthlyPrice, language);
    const target = formatEuro(alert.targetPrice, language);

    if (language === 'en') {
        return {
            subject: `Price alert: ${name} now ${price} a month`,
            text: `Hello ${user.profile.fullName},\n\n${name} now costs ${price} a month (effective price over 24 months), at or below your target of ${target}.\n\n${link}\n\nThis alert is now switched off. You can set a new one on the offer page.\n\nVadi`,
        };
    }
    return {
        subject: `Preisalarm: ${name} jetzt ${price} im Monat`,
        text: `Hallo ${user.profile.fullName},\n\n${name} kostet jetzt ${price} im Monat (Effektivpreis über 24 Monate) und liegt damit bei oder unter deinem Wunschpreis von ${target}.\n\n${link}\n\nDieser Preisalarm ist jetzt ausgeschaltet. Einen neuen kannst du auf der Angebotsseite einrichten.\n\nVadi`,
    };
}

// Email users whose target price has been reached, then switch those alerts off.
// Run after price imports and on a schedule (npm run alerts, or GET/POST /api/jobs/price-alerts).
async function checkPriceAlerts() {
    const alerts = await PriceAlert.find({ active: true }).populate('user', 'email profile.fullName settings.language');
    let triggered = 0;

    for (const [kind, Model] of Object.entries(MODELS)) {
        const kindAlerts = alerts.filter((alert) => alert.offerType === kind && alert.user);
        if (kindAlerts.length === 0) continue;
        const offers = await Model.find({ $and: [{ _id: { $in: kindAlerts.map((alert) => alert.offer) } }, activeOfferFilter()] });
        const byId = new Map(offers.map((offer) => [String(offer._id), offer]));

        for (const alert of kindAlerts) {
            const offer = byId.get(String(alert.offer));
            if (!offer || offer.effectiveMonthlyPrice > alert.targetPrice) continue;
            const mail = alertMail(alert.user, offer, alert);
            await sendMail({ to: alert.user.email, ...mail });
            alert.active = false;
            alert.triggeredAt = new Date();
            alert.triggeredPrice = offer.effectiveMonthlyPrice;
            await alert.save();
            triggered += 1;
        }
    }
    return { checked: alerts.length, triggered };
}

exports.checkPriceAlerts = checkPriceAlerts;
