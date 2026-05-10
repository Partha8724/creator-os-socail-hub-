import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_YOUTUBE_API_KEY
});

export const youtubeService = {
  async getVideoStats(videoId: string) {
    try {
      const response = await youtube.videos.list({
        part: ['statistics', 'snippet', 'topicDetails'],
        id: [videoId]
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      return {
        title: video.snippet?.title,
        description: video.snippet?.description,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
        commentCount: video.statistics?.commentCount,
        tags: video.snippet?.tags || [],
        publishedAt: video.snippet?.publishedAt,
        thumbnail: video.snippet?.thumbnails?.high?.url
      };
    } catch (error) {
      console.error('YouTube API Error (getVideoStats):', error);
      throw error;
    }
  },

  async searchVideos(query: string) {
    try {
      const response = await youtube.search.list({
        part: ['snippet'],
        q: query,
        maxResults: 10,
        type: ['video']
      });

      return response.data.items?.map(item => ({
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnail: item.snippet?.thumbnails?.high?.url,
        channelTitle: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt
      })) || [];
    } catch (error) {
      console.error('YouTube API Error (searchVideos):', error);
      throw error;
    }
  },

  async getChannelVideos(channelId: string) {
    try {
      const response = await youtube.search.list({
        part: ['snippet'],
        channelId: channelId,
        order: 'date',
        maxResults: 10,
        type: ['video']
      });
      const videoIds = response.data.items?.map(item => item.id?.videoId).filter(Boolean) as string[];
      if (!videoIds || videoIds.length === 0) return [];

      const statsResponse = await youtube.videos.list({
         part: ['statistics', 'snippet'],
         id: videoIds
      });

      return statsResponse.data.items?.map(video => ({
        id: video.id,
        title: video.snippet?.title,
        thumbnail: video.snippet?.thumbnails?.high?.url,
        description: video.snippet?.description,
        publishedAt: video.snippet?.publishedAt,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
        commentCount: video.statistics?.commentCount
      })) || [];
    } catch (error) {
      console.error('YouTube API Error (getChannelVideos):', error);
      throw error;
    }
  },

  async getChannelStats(channelUsernameOrId: string) {
    try {
      // First try to find the channel ID if username is provided
      let channelId = channelUsernameOrId;
      if (channelUsernameOrId.startsWith('@')) {
         const searchRes = await youtube.search.list({
            part: ['snippet'],
            q: channelUsernameOrId,
            type: ['channel'],
            maxResults: 1
         });
         const items = searchRes.data.items;
         if (items && items.length > 0) {
            channelId = items[0].snippet?.channelId || channelUsernameOrId;
         }
      }

      const response = await youtube.channels.list({
        part: ['statistics', 'snippet'],
        id: [channelId],
        forUsername: channelId.startsWith('@') ? undefined : channelId // handle legacy usernames but usually ids work
      });

      if (!response.data.items || response.data.items.length === 0) {
         // Fallback if id search didn't work and it was a name
         const searchFallback = await youtube.search.list({
            part: ['snippet'],
            q: channelUsernameOrId,
            type: ['channel'],
            maxResults: 1
         });
         const fallbackId = searchFallback.data.items?.[0]?.snippet?.channelId;
         if (fallbackId) {
            const fallbackResponse = await youtube.channels.list({
               part: ['statistics', 'snippet'],
               id: [fallbackId]
            });
            if (fallbackResponse.data.items && fallbackResponse.data.items.length > 0) {
               const channel = fallbackResponse.data.items[0];
               return {
                 id: channel.id,
                 title: channel.snippet?.title,
                 subscriberCount: channel.statistics?.subscriberCount,
                 viewCount: channel.statistics?.viewCount,
                 videoCount: channel.statistics?.videoCount,
                 thumbnail: channel.snippet?.thumbnails?.high?.url
               };
            }
         }
         
        throw new Error('Channel not found');
      }

      const channel = response.data.items[0];
      return {
        id: channel.id,
        title: channel.snippet?.title,
        subscriberCount: channel.statistics?.subscriberCount,
        viewCount: channel.statistics?.viewCount,
        videoCount: channel.statistics?.videoCount,
        thumbnail: channel.snippet?.thumbnails?.high?.url
      };
    } catch (error) {
      console.error('YouTube API Error (getChannelStats):', error);
      throw error;
    }
  },

  async getRelatedTags(query: string) {
    // This is a simplified version - in a real app we might use search + video details to find common tags
    try {
      const response = await youtube.search.list({
        part: ['snippet'],
        q: query,
        maxResults: 5,
        type: ['video']
      });

      const videoIds = response.data.items?.map(item => item.id?.videoId).filter(Boolean) as string[];
      if (!videoIds || videoIds.length === 0) return [];

      const videoDetails = await youtube.videos.list({
        part: ['snippet'],
        id: videoIds
      });

      const allTags = videoDetails.data.items?.flatMap(item => item.snippet?.tags || []) || [];
      // Count frequency and return top unique ones
      const tagCounts: Record<string, number> = {};
      allTags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        tagCounts[lowerTag] = (tagCounts[lowerTag] || 0) + 1;
      });

      return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);
    } catch (error) {
      console.error('YouTube API Error (getRelatedTags):', error);
      throw error;
    }
  }
};
