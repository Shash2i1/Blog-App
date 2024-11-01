import conf from '../Conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId,authorName, createdDate}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    authorName,
                    createdDate,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }

     // Like functionality
     async toggleLike(postId, userId) {
        try {
            const likeDocuments = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteLikesCollectionId,
                [Query.equal("postId", postId), Query.equal("userId", userId)]
            );

            if (likeDocuments.total > 0) {
                const likeId = likeDocuments.documents[0].$id;
                // If the like exists, remove it
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteLikesCollectionId,
                    likeId
                );
                return { liked: false }; // The like was removed
            } else {
                // If it doesn't exist, create a new like
                await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteLikesCollectionId,
                    ID.unique(),
                    {
                        postId,
                        userId,
                        status: true,
                    }
                );
                return { liked: true }; // The like was added
            }
        } catch (error) {
            console.log("Appwrite service :: toggleLike :: error", error);
            throw error; // Rethrow the error for further handling
        }
    }
    
}


const service = new Service()
export default service