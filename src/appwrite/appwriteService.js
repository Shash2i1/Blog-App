import conf from '../Conf/conf.js';
import { Client, ID, Databases, Query } from "appwrite";

class AppwriteService {
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
}

const appwriteService = new AppwriteService();
export default appwriteService;
