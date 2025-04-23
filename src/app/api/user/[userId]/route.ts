import dbConfig from '@/middlewares/db.config';
import User from '@/model/User.model';
import { NextRequest, NextResponse } from 'next/server';

dbConfig();

export async function GET(req: NextRequest) {
    try {
        // Extract userId from URL
        const pathname = req.nextUrl.pathname;
        const userId = pathname.split('/').pop();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is missing in URL' }, { status: 400 });
        }

        const user = await User.findById(userId).select('-password'); // hide password

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
