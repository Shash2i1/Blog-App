import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate

    const logoutHandler = async () => {
        await authService.logout(); // Wait for the logout to complete
        dispatch(logout()); // Dispatch the logout action
        navigate('/login'); // Redirect to the login page
    };

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-[green] hover:text-white text-gray-600 rounded-full'
            onClick={logoutHandler}
        >
            Logout
        </button>
    );
}

export default LogoutBtn;
