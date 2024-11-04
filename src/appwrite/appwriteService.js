import conf from '../Conf/conf.js';
import { Client, ID, Databases, Query } from "appwrite";

export class AppwriteService {
    constructor() {
        this.client = new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async toggleLike(postId, userId) {
        try {
            const existingLike = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [Query.equal("postId", postId), Query.equal("userId", userId)]
            );

            if (existingLike.total > 0) {
                // If the like exists, delete it
                const likeId = existingLike.documents[0].$id;
                await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteLikesCollectionId, likeId);
                return { liked: false };
            } else {
                // If it doesn't exist, create a new like
                await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteLikesCollectionId, ID.unique(), { postId, userId, status: true });
                return { liked: true };
            }
        } catch (error) {
            console.error("Error in toggleLike:", error);
            throw error;
        }
    }

    async getLikesCount(postId) {
        try {
            const likes = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [Query.equal("postId", postId)]
            );
            return likes.total;
        } catch (error) {
            console.error("Error fetching likes count:", error);
            return 0;
        }
    }

    // New method to check if the user has liked the post
    async userHasLikedPost(postId, userId) {
        try {
            const result = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [Query.equal("postId", postId), Query.equal("userId", userId)]
            );
            return result.total > 0; // Return true if any document is found
        } catch (error) {
            console.error("Error checking user like status:", error);
            return false; // Assume user hasn't liked the post in case of error
        }
    }

    // New method to create a comment
    async createComment(postId, userId, content, username) {
        try {
            const commentData = {
                postId,
                userId,
                content,
                username, // Add username here
                createdDate: new Date().toISOString(),
            };
            await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCommentsCollectionId, ID.unique(), commentData);
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    }
    

    // New method to get comments for a specific post
    async getComments(postId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsCollectionId,
                [Query.equal("postId", postId)]
            );
            console.log("Fetched comments response:", response); // Log the response
            return response.documents || []; // Ensure it returns an empty array if no documents
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCommentsCollectionId, commentId);
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error; // Optionally rethrow the error to handle it in the component
        }
    }
}

const appwriteService = new AppwriteService();
export default appwriteService;
