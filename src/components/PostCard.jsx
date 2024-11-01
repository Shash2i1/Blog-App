import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton'; // Ensure the path to LikeButton is correct

function PostCard({ post }) {
    if (!post) {
        return null;
    }

    const { $id, title, featuredImage, authorName, createdDate, likesCount } = post; // Ensure likesCount is part of the post object
    const filePreviewUrl = featuredImage ? appwriteService.getFilePreview(featuredImage) : null;

    return (
        <div className='w-full bg-white text-black rounded-xl p-4 border-2 shadow-xl duration-200 hover:shadow-2xl'>
            <Link to={`/post/${$id}`}>
                <div className='w-full justify-center mb-4 py-5'>
                    <div className='flex flex-col w-full h-auto mb-2 lg:text-[15px] p-2 sm:text-[10px] py-2'>
                        <h4><span className='text-green-400'>Author :</span>{authorName} </h4>
                        <h4><span className='text-green-400'>Created:</span>{createdDate}</h4>
                    </div>
                    {filePreviewUrl ? (
                        <img src={filePreviewUrl} alt={title} className='rounded-xl' />
                    ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-300 rounded-xl">
                            <p>No Image Available</p>
                        </div>
                    )}
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
            </Link>
            <LikeButton postId={$id} initialLikesCount={likesCount || 0} />
        </div>
    );
}

export default PostCard;
