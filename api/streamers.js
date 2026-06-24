import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const KEY = 'poletto_streamers';

    if (req.method === 'GET') {
        const streamers = await kv.get(KEY) || [];
        return res.status(200).json(streamers);
    }

    if (req.method === 'POST') {
        const streamers = await kv.get(KEY) || [];
        const newStreamer = { ...req.body, id: Date.now() };
        streamers.push(newStreamer);
        await kv.set(KEY, streamers);
        return res.status(200).json({ ok: true, streamers });
    }

    if (req.method === 'PUT') {
        const streamers = await kv.get(KEY) || [];
        const { index, ...data } = req.body;
        if (index >= 0 && index < streamers.length) {
            streamers[index] = { ...streamers[index], ...data };
            await kv.set(KEY, streamers);
            return res.status(200).json({ ok: true, streamers });
        }
        return res.status(400).json({ error: 'Invalid index' });
    }

    if (req.method === 'DELETE') {
        const streamers = await kv.get(KEY) || [];
        const { index } = req.body;
        if (index >= 0 && index < streamers.length) {
            streamers.splice(index, 1);
            await kv.set(KEY, streamers);
            return res.status(200).json({ ok: true, streamers });
        }
        return res.status(400).json({ error: 'Invalid index' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
