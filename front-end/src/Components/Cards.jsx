import React, { useState, useEffect } from 'react';
import Card from './Card';

export default function Cards() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [reachedEnd, setReachedEnd] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://api.weekday.technology/adhoc/getSampleJdJSON?page=${page}&limit=12`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    "limit": 12,
                    "offset": (page - 1) * 12
                })
            });
            const result = await response.json();
            if (result.jdList.length === 0) {
                setReachedEnd(true);
            } else {
                setData(prevData => [...prevData, ...result.jdList]);
                setPage(prevPage => prevPage + 1);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100
            && !loading
            && !reachedEnd
        ) {
            fetchData();
        }
    };

    useEffect(() => {
        if(page!=1){
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [loading, reachedEnd]);

    return (
        <>
            <div className='flex flex-wrap'>
                {data.map((job, index) => (
                    <div className='w-[30%] p-10' key={index}>
                        <Card data={job} />
                    </div>
                ))}
            </div>
            {loading && <div>Loading...</div>}
            {reachedEnd && <div>No more data</div>}
        </>
    );
}
