import dbConfig from '@/middlewares/db.config';
import User from '@/model/User.model';
import { NextRequest, NextResponse } from 'next/server';

dbConfig();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        

        const userId = params.userId;

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
