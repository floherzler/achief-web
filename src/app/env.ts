const env = {
    appwrite: {
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
        project_id: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        api_key: String(process.env.NEXT_PUBLIC_APPWRITE_API_KEY),
    }
}

export default env