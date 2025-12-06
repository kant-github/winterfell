import { NextRequest, NextResponse } from 'next/server';

function proxy(request: NextRequest) {
    const token = request.cookies.get('next-auth.session-token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export { proxy as middleware };

export const config = {
    matcher: ['/playground/:path*'],
};