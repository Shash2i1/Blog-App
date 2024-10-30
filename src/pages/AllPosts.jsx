import React, { useEffect, useState } from "react";
import appwriteService from '../appwrite/config';
import { Container, PostCard } from "../components";

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents);
                //console.log(posts);
            }
        });
    }, []);

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap justify-center sm:justify-start">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-2 w-full sm:w-1/2 lg:w-1/4">
                            <PostCard post={post} />
                            
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
