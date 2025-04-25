const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    price: { type: Number, required: true },
    expert: { type: String, required: true }
});

const predefinedServices = [
    { serviceName: "جلسه ایده پردازی", price: 0, expert: "" },
    { serviceName: "تحقیق بازار", price: 0, expert: "" },
    { serviceName: "تحلیل رقبا", price: 0, expert: "" },
    { serviceName: "مطالعه امکان‌سنجی", price: 0, expert: "" },
    { serviceName: "طراحی اولیه", price: 0, expert: "" },
    { serviceName: "ساخت نمونه اولیه", price: 0, expert: "" },
    { serviceName: "آزمایش نمونه اولیه", price: 0, expert: "" },
    { serviceName: "آزمایش واحد", price: 0, expert: "" },
    { serviceName: "آزمایش یکپارچه‌سازی", price: 0, expert: "" },
    { serviceName: "بازخورد کاربران", price: 0, expert: "" },
    { serviceName: "راه اندازی وبسایت و هاست", price: 0, expert: "" },
    { serviceName: "پیکربندی تولید", price: 0, expert: "" },
    { serviceName: "عرضه محصول", price: 0, expert: "" }
]
    ;

const costSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
        selectedServices: {
            type: [
                {
                    serviceName: {
                        type: String,
                        required: true,
                        enum: predefinedServices.map(service => service.serviceName)
                    },
                    paid: { type: Boolean, default: false },
                    price: { type: Number, required: true },
                    expert: { type: String },
                }
            ],
        }
    },
    { timestamps: true }
);


const Cost = mongoose.model("Cost", costSchema);

module.exports = {
    Cost,
    predefinedServices,
};