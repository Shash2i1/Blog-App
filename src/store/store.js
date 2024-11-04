import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import commentsSlice from './commentsSlice'; // Import comments slice

const store = configureStore({
    reducer: {
        auth: authSlice,
        comments: commentsSlice, // Add comments slice to the store
        // TODO: add more slices here for posts
    },
});

export default store;
