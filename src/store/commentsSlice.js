import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comments: [], // Array to hold comments
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload; // Set comments from the payload
        },
        addComment: (state, action) => {
            state.comments.push(action.payload); // Add a new comment
        },
    },
});

export const { setComments, addComment } = commentsSlice.actions;

export default commentsSlice.reducer;
