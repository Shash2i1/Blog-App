import React, { useState } from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentsSection from './Comments';

function PostCard({ post }) {
    // Check if the post is undefined or null
    if (!post) {
        return null; // Return null to prevent rendering when post is not available
    }

    const [showComments, setShowComments] = useState(false);
    
    const { $id, title, featuredImage, authorName, createdDate, likesCount } = post;
    const filePreviewUrl = featuredImage ? appwriteService.getFilePreview(featuredImage) : null;

    return (
        <div className='w-full bg-white text-black rounded-xl p-4 border-2 shadow-xl duration-200 hover:shadow-2xl'>
            <Link to={`/post/${$id}`}>
                <div className='w-full justify-center mb-4 py-5'>
                    <div className='flex flex-col w-full h-auto mb-2 lg:text-[15px] p-2 sm:text-[10px] py-2'>
                        <h4><span className='text-green-400'>Author :</span>{authorName}</h4>
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
            <div className='flex items-center justify-between mt-4'> {/* Use justify-between for spacing */}
                <LikeButton postId={$id} initialLikesCount={likesCount || 0} />
                <button
                    onClick={() => setShowComments(prev => !prev)} // Toggle comments visibility
                    className="text-gray-600 hover:text-gray-800"
                >
                    💬 {/* This is the comment icon */}
                </button>
            </div>
            {showComments && (
                <div className="mt-4"> {/* Add some margin above comments section */}
                    <CommentsSection
                        postId={$id}
                        closeModal={() => setShowComments(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default PostCard;
