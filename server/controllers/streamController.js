const { StreamChat } = require('stream-chat');
const fs = require('fs');

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const chatClient = StreamChat.getInstance(apiKey, apiSecret);

exports.generateToken = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'User ID is required' });

        const log = (msg) => fs.appendFileSync('stream_debug.log', `[${new Date().toISOString()}] ${msg}\n`);

        log(`Generating token for user: ${userId}`);

        // Upsert user to Stream
        await chatClient.upsertUser({
            id: userId,
            role: 'user',
        });
        log('User upserted');

        // Create or get the general channel and add user as member
        const channel = chatClient.channel('messaging', 'general-v2', {
            name: 'General Room V2',
            created_by_id: 'admin',
        });

        try {
            await channel.create();
            log('Channel created');
        } catch (err) {
            log(`Channel creation failed (might exist): ${err.message}`);
        }

        await channel.addMembers([userId]);
        log('User added to channel');

        const token = chatClient.createToken(userId);
        res.json({ token, apiKey });
    } catch (error) {
        if (fs.existsSync('stream_debug.log')) {
            fs.appendFileSync('stream_debug.log', `[${new Date().toISOString()}] Error: ${error.message}\n`);
        }
        console.error('Stream Token Error:', error);
        res.status(500).json({ message: error.message });
    }
};
