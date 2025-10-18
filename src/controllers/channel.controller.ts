import { NextApiResponse } from 'next';
import { APIReq } from './user.controller';
import Channel from '@/models/channel.model';
import User from '@/models/user.model';
import Video from '@/models/video.model';
import { getBaseUrl } from '@/lib';

// Create or update a channel
export const createOrUpdateChannel = async (
  req: APIReq,
  res: NextApiResponse,
) => {
  const { name, description, image } = req.body;
  const userId = req.user?._id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!name)
    return res.status(400).json({ message: 'Channel name is required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    let channel = await Channel.findOne({ owner: userId });

    if (channel) {
      // Update existing channel
      channel.name = name;
      channel.description = description;
      if (image) channel.image = image;
      await channel.save();
    } else {
      // Create new channel
      channel = await Channel.create({
        name,
        description,
        image: image || user.image,
        owner: userId,
      });
    }

    // Always update user's channel reference
    user.channel = channel._id;
    await user.save();

    // Populate user.channel before sending response
    const userWithChannel = await User.findById(userId).populate('channel');

    return res.status(channel ? 200 : 201).json({
      message: channel ? 'Channel updated' : 'Channel created',
      channel,
      user: userWithChannel,
    });
  } catch (err: any) {
    console.error('Channel create/update error:', err);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Subscribe or unsubscribe to a channel
export const toggleSubscription = async (req: APIReq, res: NextApiResponse) => {
  const { channelId } = req.body;
  const userId = req.user?._id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!channelId)
    return res.status(400).json({ message: 'Channel ID is required' });

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const isSubscribed = channel.subscribers.includes(userId);
    if (isSubscribed) {
      channel.subscribers.pull(userId);
      await channel.save();
      return res.status(200).json({
        message: 'Unsubscribed',
        subscribersCount: channel.subscribers.length,
      });
    }

    channel.subscribers.push(userId);
    await channel.save();
    return res.status(200).json({
      message: 'Subscribed',
      subscribersCount: channel.subscribers.length,
    });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Get all channels a user is subscribed to
export const getSubscribedChannels = async (
  req: APIReq,
  res: NextApiResponse,
) => {
  
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const channels = await Channel.find({ subscribers: userId }).lean();
    return res.status(200).json({
      message: 'Fetched subscriptions',
      channels,
    });
  } catch (err: any) {
    console.error('Fetch subscriptions error:', err);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};

// Get a single channel by ID
export const getChannelById = async (req: APIReq, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: 'Channel ID is required' });

  try {
    const host = getBaseUrl(req); // get base URL for streaming

    // 1️⃣ Fetch channel
    const channel = await Channel.findById(id)
      .populate('owner', 'name email image')
      .lean();
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    // 2️⃣ Fetch channel videos
    const videosRaw = await Video.find({ channel: id })
      .populate('channel', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    // 3️⃣ Format videos like getVideo API
    const videos = videosRaw.map((v) => ({
      ...v,
      filepath: `${host}/api/video/stream/${v._id}`,
      likes: v.likes.length,
      dislikes: v.dislikes.length,
    }));

    // 4️⃣ Return channel + videos
    return res.status(200).json({
      message: 'Channel fetched successfully',
      channel: {
        ...channel,
        subscribers: channel.subscribers.length,
        videos,
      },
    });
  } catch (err: any) {
    console.error('Get channel error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};
