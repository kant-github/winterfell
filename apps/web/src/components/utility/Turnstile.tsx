import { Turnstile } from '@marsidev/react-turnstile';

<Turnstile
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
    onSuccess={(token) => {
        setTurnstileToken(token);
    }}
    onError={() => {
        setTurnstileToken(null);
    }}
    onExpire={() => {
        setTurnstileToken(null);
    }}
    options={{
        theme: 'dark',
        size: 'normal',
    }}
/>;
