import React from 'react';
import Banner from '../Banner/Banner';
import Member from '../Member/Member';

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Banner></Banner>
            <Member></Member>
        </div>
    );
};

export default Home;