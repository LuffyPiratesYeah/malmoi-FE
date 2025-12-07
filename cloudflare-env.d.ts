// 1. Cloudflare Workers 환경 변수 타입 정의
// 이 타입은 getCloudflareContext().env의 타입을 지정하여 TS2339 에러를 해결합니다.
interface SecretsStoreSecret {
    /**
     * Get a secret from the Secrets Store, returning a string of the secret value
     * if it exists, or throws an error if it does not exist
     */
    get(): Promise<string>;
}
interface CloudflareEnv {
  // wrangler.toml의 secrets_store_secrets에 정의된 바인딩 이름과 일치해야 합니다.
  SUPABASE_SERVICE_ROLE_KEY: SecretsStoreSecret;

  // 필요한 다른 Secret 변수들을 여기에 추가합니다.
  // 예: DB: D1Database;
}

// 2. Next.js/Node.js 환경 변수 타입 확장
// Node.js의 process.env 타입에 wrangler.toml의 vars에 있는 변수들을 추가합니다.
// 이 타입 확장은 TypeScript에게 EMAIL_PORT가 string임을 알려주어 비교 에러를 해결합니다.
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    // EMAIL_PORT는 반드시 string 타입으로만 정의해야 의미 없는 비교 에러를 방지합니다.
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    // 필요한 다른 vars 변수들을 여기에 추가합니다.
  }
}