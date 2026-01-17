import React from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <div className='bg-green-100'>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;