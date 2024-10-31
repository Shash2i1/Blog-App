import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';

function PostCard({ post }) {
    // Check if post is defined before destructuring
    if (!post) {
        return null; // or some fallback UI
    }

    const { $id, title, featuredImage,authorName , createdDate } = post;

    const filePreviewUrl = featuredImage ? appwriteService.getFilePreview(featuredImage) : null;
    //console.log(filePreviewUrl)
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full  hover:bg-[#FF401A] hover:text-white bg-white text-black rounded-xl p-4 border-2 shadow-xl duration-200 '>
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
            </div>
        </Link>
    );
}

export default PostCard;
