class Config {
    public static readonly apiUrl: string
        = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    public static readonly healthCheckToken: string
        = import.meta.env.VITE_HEALTHCHECK_TOKEN || '';
}

export default Config;
