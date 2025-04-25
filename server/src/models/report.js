const mongoose = require('mongoose');

const defaultStages = [
    {
        stageTitle: "ارزیابی ایده",
        stageStatus: "Not Started",
        tasks: [
            { taskTitle: "جلسه ایده پردازی", taskStatus: "Not Started", description: "" },
            { taskTitle: "تحقیق بازار", taskStatus: "Not Started", description: "" },
            { taskTitle: "تحلیل رقبا", taskStatus: "Not Started", description: "" },
            { taskTitle: "مطالعه امکان‌سنجی", taskStatus: "Not Started", description: "" },
        ],
    },
    {
        stageTitle: "توسعه نمونه اولیه",
        stageStatus: "Not Started",
        tasks: [
            { taskTitle: "طراحی اولیه", taskStatus: "Not Started", description: "" },
            { taskTitle: "ساخت نمونه اولیه", taskStatus: "Not Started", description: "" },
            { taskTitle: "آزمایش نمونه اولیه", taskStatus: "Not Started", description: "" },
        ],
    },
    {
        stageTitle: "آزمایش",
        stageStatus: "Not Started",
        tasks: [
            { taskTitle: "آزمایش واحد", taskStatus: "Not Started", description: "" },
            { taskTitle: "آزمایش یکپارچه‌سازی", taskStatus: "Not Started", description: "" },
            { taskTitle: "بازخورد کاربران", taskStatus: "Not Started", description: "" },
        ],
    },
    {
        stageTitle: "توسعه و استقرار",
        stageStatus: "Not Started",
        tasks: [
            { taskTitle: "راه‌اندازی هاست", taskStatus: "Not Started", description: "" },
            { taskTitle: "پیکربندی تولید", taskStatus: "Not Started", description: "" },
            { taskTitle: "عرضه محصول", taskStatus: "Not Started", description: "" },
        ],
    },
];

const taskSchema = new mongoose.Schema({
    taskTitle: { type: String, required: true, immutable: true },
    taskStatus: { type: String, required: true, enum: ['Completed', 'In Progress', 'Not Started'] },
    description: { type: String, default: "" },
});

const stageSchema = new mongoose.Schema({
    stageTitle: { type: String, required: true, immutable: true },
    stageStatus: { type: String, required: true, enum: ['Completed', 'In Progress', 'Not Started'] },
    tasks: { type: [taskSchema], required: true },
});

const reportSchema = new mongoose.Schema({
    ideaTitle: { type: String, required: true },
    ideaId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Idea' },
    ownerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    stages: { type: [stageSchema], default: defaultStages },
    createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = {
    Report,
    defaultStages,
};
