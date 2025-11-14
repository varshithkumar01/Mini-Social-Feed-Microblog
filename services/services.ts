import { GoogleGenAI, Type } from "@google/genai";
import type { User, Post } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const userSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique UUID for the user' },
        name: { type: Type.STRING, description: 'A plausible full name' },
        username: { type: Type.STRING, description: 'A short, creative username without spaces' },
        avatarUrl: { type: Type.STRING, description: 'A URL from picsum.photos using a unique seed (e.g., https://picsum.photos/seed/{username}/100/100)' },
    },
    required: ['id', 'name', 'username', 'avatarUrl'],
};

const commentSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique UUID for the comment' },
        authorId: { type: Type.STRING, description: 'The id of one of the generated users' },
        text: { type: Type.STRING, description: 'A short, relevant comment' },
        timestamp: { type: Type.STRING, description: 'An ISO 8601 string, later than the post\'s timestamp' },
    },
    required: ['id', 'authorId', 'text', 'timestamp'],
};

const postSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique UUID for the post' },
        authorId: { type: Type.STRING, description: 'The id of one of the generated users' },
        content: { type: Type.STRING, description: 'A short post, 1-3 sentences, on topics like technology, travel, food, or daily life musings' },
        timestamp: { type: Type.STRING, description: 'An ISO 8601 string from within the last 24 hours' },
        likeCount: { type: Type.INTEGER, description: 'A random integer between 0 and 150' },
        comments: {
            type: Type.ARRAY,
            items: commentSchema,
        },
    },
    required: ['id', 'authorId', 'content', 'timestamp', 'likeCount', 'comments'],
};

const feedSchema = {
    type: Type.OBJECT,
    properties: {
        users: {
            type: Type.ARRAY,
            description: 'An array of 5 unique user objects',
            items: userSchema,
        },
        posts: {
            type: Type.ARRAY,
            description: 'An array of 8 diverse and engaging microblog posts',
            items: postSchema,
        },
    },
    required: ['users', 'posts'],
};


export const generateInitialFeed = async (): Promise<{ users: User[]; posts: Post[] }> => {
  try {
    const prompt = `Generate a JSON object with two keys: "users" and "posts" for a mini social media feed called "NovaFeed".
    - "users" should be an array of 5 unique, creative user objects.
    - "posts" should be an array of 8 diverse and engaging microblog posts, authored by the generated users.
    - Comments on posts should also be authored by the generated users.
    - Ensure all IDs are unique UUIDs.
    - Make the content feel authentic and varied.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: feedSchema,
        },
    });

    const jsonString = response.text;
    const data = JSON.parse(jsonString);

    // Add empty likedBy array to each post
    const postsWithLikes = data.posts.map((post: Post) => ({
      ...post,
      likedBy: [],
    }));

    return { users: data.users, posts: postsWithLikes };
  } catch (error) {
    console.error("Error generating initial feed:", error);
    throw new Error("Failed to fetch data from Gemini API. Please check your API key and try again.");
  }
};
