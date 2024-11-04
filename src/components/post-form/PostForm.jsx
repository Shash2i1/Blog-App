import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import imageCompression from "browser-image-compression"; // Import the compression library

export default function PostForm({ post }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loader state

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    // Compress Image Function
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1, // Set maximum size in MB
            maxWidthOrHeight: 1200, // Max width or height for resized image
            useWebWorker: true,
        };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Error during image compression:", error);
            return file; // Fallback to the original file if compression fails
        }
    };

    const submit = async (data) => {
        setIsLoading(true); // Set loading to true
        try {
            let file = null;
            if (data.image && data.image[0]) {
                // Compress image before uploading
                file = await compressImage(data.image[0]);
                file = new File([file], data.image[0].name, { type: data.image[0].type }); // Ensure it's a File object
            }

            if (post) {
                if (file) {
                    await appwriteService.deleteFile(post.featuredImage); // Ensure this is awaited
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    setModalMessage("Post updated successfully!");
                    setModalOpen(true);
                    setTimeout(() => {
                        navigate(`/post/${dbPost.$id}`); // Delay navigation
                        setIsLoading(false); // Set loading to false before navigation
                    }, 2000); 
                }
            } else {
                if (file) {
                    const fileId = await appwriteService.uploadFile(file); // Upload compressed file
                    data.featuredImage = fileId.$id;
                }

                const date = new Date();
                const month_list = ['Jan','Feb','March','April','May','Jun','July','Aug','Sep','Oct','Nov','Dec']
                const month = month_list.at(date.getMonth())
                
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.userData.$id,
                    authorName: userData.userData.name,
                    createdDate: `${date.getDate()}, ${month} ${date.getFullYear()}`,
                });

                if (dbPost) {
                    setModalMessage("Post created successfully!");
                    setModalOpen(true);
                    setTimeout(() => {
                        navigate(`/post/${dbPost.$id}`); // Delay navigation
                        setIsLoading(false); // Set loading to false before navigation
                    }, 2000); 
                }
            }
        } catch (error) {
            console.error(error);
            setModalMessage("An error occurred while saving the post.");
            setModalOpen(true);
        } finally {
            setIsLoading(false); // Ensure loading is set to false if it hasn't been already
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-6">
                        <h2 className="text-lg font-semibold mb-4">Notification</h2>
                        <p className="mb-4">{modalMessage}</p>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-full sm:w-2/3 px-2">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="mb-4"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        className="mb-4"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4 sm:mt-0">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4"
                        {...register("status", { required: true })}
                    />
                    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                        {isLoading ? ( // Loader condition
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
                                </svg>
                                Posting...
                            </div>
                        ) : (
                            post ? "Update" : "Post"
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
}
