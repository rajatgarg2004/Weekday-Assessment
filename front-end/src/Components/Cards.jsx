import React, { useState, useEffect } from 'react';
import Card from './Card';

export default function Cards() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
        "limit": 12,
        "offset": 0
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body
    };

    const [data, setData] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                const response = fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
                .then((response) => response.json())
                .then((result) => {setData(result)})
                .catch((error) => console.error(error));
            } catch (error) {
                console.error(error);
            }
        }
        loadData();
    }, []); 
    return (
        <div className='flex flex-wrap'>
            {data ? (
                data.jdList.map((job, index) => (
                    <div className='w-[30%] p-10' key={index}>
                        <Card data={job} />
                    </div>
                ))
            ) : (
                <h1>No Data</h1>
            )}
        </div>
    );
}
