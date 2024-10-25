const env = {
    appwrite: {
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
        project_id: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        api_key: String(process.env.NEXT_PUBLIC_APPWRITE_API_KEY),
        db: String(process.env.NEXT_PUBLIC_DATABASE_ID),
        storage: String(process.env.NEXT_PUBLIC_STORAGE_ID),
    }
}

export default env