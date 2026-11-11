// Build the MongoDB connection string from the environment.
// MONGODB_URI wins if set; otherwise the Atlas URI is assembled from its parts.
export function getMongoUri(): string {
    const env = process.env;
    if (env.MONGODB_URI) {
        return env.MONGODB_URI;
    }

    const required = ['DB_USER', 'DB_PASSWORD', 'SUFFIX', 'AFTER_SUFFIX', 'DB_NAME'];
    const missing = required.filter((key) => !env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    // Checked above
    const user = encodeURIComponent(env.DB_USER as string);
    const password = encodeURIComponent(env.DB_PASSWORD as string);
    const appName = env.APP_NAME ? `&appName=${env.APP_NAME}` : '';
    return `mongodb+srv://${user}:${password}@${env.SUFFIX}.${env.AFTER_SUFFIX}.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority${appName}`;
}
