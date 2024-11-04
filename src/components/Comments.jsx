import React, { useEffect, useRef, useState } from 'react';
import appwriteService from "../appwrite/appwriteService";
import { useSelector } from "react-redux";

const CommentsSection = ({ postId, closeModal }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(false);
    const [error, setError] = useState("");
    const userData = useSelector((state) => state.auth.userData);
    const commentsEndRef = useRef(null); // Reference to scroll to the bottom

    useEffect(() => {
        const fetchComments = async () => {
            setFetchingComments(true);
            try {
                const commentsResponse = await appwriteService.getComments(postId);
                console.log("Comments fetched:", commentsResponse);
                setComments(commentsResponse);
            } catch (error) {
                setError("Failed to fetch comments.");
            } finally {
                setFetchingComments(false);
            }
        };

        fetchComments();
    }, [postId]);

    useEffect(() => {
        // Scroll to the bottom of the comments whenever they change
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]); // This effect runs whenever comments change

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;
        setLoading(true);

        try {
            const tempComment = {
                $id: "temp-id",
                username: userData.userData.name,
                content: newComment,
                createdDate: new Date().toISOString(),
                userId: userData.userData.$id
            };

            setComments((prevComments) => [...prevComments, tempComment]);
            setNewComment("");

            const createdComment = await appwriteService.createComment(
                postId, 
                userData.userData.$id, 
                newComment, 
                userData.userData.name
            );

            setTimeout(() => {
                const fetchComments = async () => {
                    setFetchingComments(true);
                    try {
                        const commentsResponse = await appwriteService.getComments(postId);
                        setComments(commentsResponse);
                    } catch (error) {
                        setError("Failed to fetch comments.");
                    } finally {
                        setFetchingComments(false);
                    }
                };
                fetchComments();
            }, 1000);

        } catch (error) {
            setError("Failed to add comment.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setLoading(true);
        try {
            await appwriteService.deleteComment(commentId);
            setComments((prevComments) => prevComments.filter(comment => comment.$id !== commentId));
        } catch (error) {
            setError("Failed to delete comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
            <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                        ✖
                    </button>
                </div>
                <div className="mt-4 max-h-60 overflow-y-auto">
                    {fetchingComments ? (
                        <p className="text-gray-500">Loading comments...</p>
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.$id} className="border-b py-2">
                                <p className="text-sm font-semibold text-[12px] flex flex-row justify-between">{comment?.username || 'Anonymous'}
                                <p className="text-xs text-gray-500">
                                    {comment.createdDate ? new Date(comment.createdDate).toLocaleString() : 'Date unavailable'}
                                </p>
                                </p>
                                <p>{comment?.content || 'No content available'}</p>
                                {userData && userData.userData.$id === comment.userId && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.$id)}
                                        className="text-red-500 text-xs"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                    {/* Scroll reference at the end of comments */}
                    <div ref={commentsEndRef} />
                </div>
                <div className="mt-4 flex items-center">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="border rounded-md p-2 w-full text-sm"
                        disabled={loading}
                    />
                    <button onClick={handleAddComment} className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2" disabled={loading}>
                        {loading ? "Loading..." : "Comment"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default CommentsSection;
