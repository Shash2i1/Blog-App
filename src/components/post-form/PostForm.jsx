import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
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
    const [modalMessage, setModalMessage] = useState(""); // State for modal message
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [redirectUrl, setRedirectUrl] = useState(""); // State for redirect URL

    const submit = async (data) => {
        let message = "";
        let urlToNavigate = ""; // Variable to hold the URL for navigation

        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                message = "Post updated successfully!";
                urlToNavigate = `/post/${dbPost.$id}`;
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const date = new Date();
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.userData.$id,
                    authorName: userData.userData.name,
                    createdDate: date.toLocaleDateString(),
                });

                if (dbPost) {
                    message = "Post created successfully!";
                    urlToNavigate = `/post/${dbPost.$id}`;
                }
            }
        }

        // Show modal if message is set
        if (message) {
            setModalMessage(message);
            setRedirectUrl(urlToNavigate);
            setModalVisible(true);
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

    const closeModal = () => {
        setModalVisible(false);
        setModalMessage("");

        // Navigate to the redirect URL after closing the modal
        if (redirectUrl) {
            navigate(redirectUrl);
            setRedirectUrl(""); // Clear the redirect URL
        }
    };

    return (
        <>
            {/* Modal Component */}
            {isModalVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Notification</h2>
                        <p>{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                        {post ? "Update" : "Post"}
                    </Button>
                </div>
            </form>
        </>
    );
}
