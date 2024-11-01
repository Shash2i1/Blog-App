import React, { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import appwriteService from '../appwrite/appwriteService';
import authService from '../appwrite/auth';

const LikeButton = ({ postId, initialLikesCount }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Declare the isLoggedIn state

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    setUserId(user.$id);
                    setIsLoggedIn(true); // User is logged in

                    // Check if the user has liked the post
                    const hasLiked = await appwriteService.userHasLikedPost(postId, user.$id);
                    setLiked(hasLiked); // Update liked state based on the check
                } else {
                    setIsLoggedIn(false); // No user returned
                }
            } catch (error) {
                console.error("User not logged in or error fetching user:", error);
                setIsLoggedIn(false);
            }
        };

        fetchUser();
    }, [postId]); // Add postId to the dependency array

    useEffect(() => {
        const fetchLikes = async () => {
            const likes = await appwriteService.getLikesCount(postId);
            setLikesCount(likes);
        };

        fetchLikes();
    }, [postId]);

    const handleLikeToggle = async () => {
        if (!isLoggedIn) {
            console.log("User is not logged in.");
            return;
        }

        try {
            const result = await appwriteService.toggleLike(postId, userId);
            setLiked(result.liked);
            setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1));
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <button onClick={handleLikeToggle} disabled={!isLoggedIn}>
            {liked ? <AiFillHeart className="text-red-500" size={24} /> : <AiOutlineHeart className="text-gray-400" size={24} />}
            <span>{likesCount}</span>
            {!isLoggedIn && <span className="text-sm text-red-500">Login to like</span>}
        </button>
    );
};

export default LikeButton;
