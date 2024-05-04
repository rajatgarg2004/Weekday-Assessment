import React, { useState, useEffect } from 'react';
import Card from './Card';

export default function Cards() {
    // Initialize headers for fetch request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // State variables
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [reachedEnd, setReachedEnd] = useState(false);
    const [change,setChange] = useState(false);
    const [limit,setLimit] = useState(12);
    const [filters, setFilters] = useState({
        minExp: '',
        companyName: '',
        remote: false,
        location: '',
        jobRole: '',
        minJdSalary: ''
    });
    // Fetch data from API
    const fetchData = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await fetch(`https://api.weekday.technology/adhoc/getSampleJdJSON`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    "limit": limit,
                    "offset": (pageNumber - 1) * limit
                })
            });
            const result = await response.json();
            if (result.jdList.length === 0) {
                setReachedEnd(true);
            } else {
                if (pageNumber === 1) {
                    setData(result.jdList);
                } else {
                    setData(prevData => [...prevData, ...result.jdList]);
                }
                setPage(prevPage => prevPage + 1);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    // Initial data fetch on component mount to get first 12 jobs
    useEffect(() => {
        fetchData(1);
    }, []);

    // Function to handle scrolling and fetch more data when nearing end

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100
            && !loading
            && !reachedEnd
        ) {
            fetchData(page,12);
        }
        const distanceToBottom = document.documentElement.offsetHeight - window.innerHeight - window.scrollY;
        if (distanceToBottom < 50) {
            window.scrollTo(0, window.scrollY - 50);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, reachedEnd, page, filters]);

    // Effect to reset page and fetch data when filters change
    useEffect(() => {
        setPage(1);
        setData([]);
        setReachedEnd(false);
        if(change){
            setLimit(70);
            fetchData(1);
        }
    }, [filters]);
    
    // Function to handle changes in filter inputs
    const handleFilterChange = (event) => {
        const { name, value, type } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? event.target.checked : value
        }));
        setChange(true);
    };
    const filterItems = (data) => {
        for (let filter in filters) {
            if (!(filter in data)) {
                continue;
            }
            if (filters[filter] === '') {
                continue;
            } else {
                if (filter === 'minExp') {
                    if ( parseInt(filters[filter]) < parseInt(data[filter]) || (data['maxExp'] && parseInt(filters[filter]) > parseInt(data['maxExp']))) {
                        return false;
                    }
                } else if (filter == 'minJdSalary') {
                    if (parseInt(filters[filter]) < parseInt(data[filter]) || (data['maxJdSalary'] && parseInt(filters[filter]) > parseInt(data['maxJdSalary']))) {
                        return false;
                    }
                }
                else {
                    if (!(data[filter].toLowerCase().includes(filters[filter].toLowerCase()))) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    const minItemsToDisplay = 6;
    return (
        <>
            <div className='flex flex-col xl:flex-row xl:justify-between  lg:justify-center md:justify-center mb-10'>
                <div className='flex flex-row justify-between mb-4 xl:mb-0 2xl:text-2xl xl:text-xl md:text-xl sm:text-sm text-xs'>
                    <input type="number" name="minExp" defaultValue={filters.minExp} className="text-center rounded-lg p-4 mb-2 lg:mb-0 w-[30%] 2xl:[1rem] xl:text-[1rem] md:text-[1rem] sm:text-[0.79rem] text-[0.7rem]" onChange={handleFilterChange} placeholder='Minimum Experience' />
                    <input type="text" name="companyName" defaultValue={filters.companyName} className="text-center rounded-lg p-4 mb-2 lg:mb-0 w-[30%] 2xl:[1rem] xl:text-[1rem] md:text-[1rem] sm:text-[0.79rem] text-[0.7rem]" onChange={handleFilterChange} placeholder='Company Name' />
                    <input type="text" name="location" defaultValue={filters.location} className="text-center rounded-lg p-4 mb-2 lg:mb-0 w-[30%] 2xl:[1rem] xl:text-[1rem] md:text-[1rem] sm:text-[0.79rem] text-[0.7rem]" onChange={handleFilterChange} placeholder='Location' />
                </div>
                <div className='flex flex-row justify-between mb-4 xl:mb-0'>
                    <div className='flex flex-col items-center mb-2 lg:mb-0 justify-center w-[30%] xl:text-xl md:text-xl sm:text-sm text-xs'>
                        <label className="flex items-center p-[0.25rem]">
                            <input
                                type="radio"
                                name="remote"
                                value="onsite"
                                checked={!filters.remote}
                                onChange={() => setFilters({ ...filters, remote: false })}
                            />
                            <span className="ml-2">OnSite</span>
                        </label>
                        <label className="flex items-center p-[0.25rem]">
                            <input
                                type="radio"
                                name="remote"
                                value="remote"
                                checked={filters.remote}
                                onChange={() => setFilters({ ...filters, remote: true })}
                            />
                            <span className="ml-2">Remote</span>
                        </label>
                    </div>

                    <input name="jobRole" type="text" defaultValue={filters.jobRole} className="text-center rounded-lg p-4 mb-2 lg:mb-0 lg: w-[30%] 2xl:[1rem] xl:text-[1rem] md:text-[1rem] sm:text-[0.79rem] text-[0.7rem]" onChange={handleFilterChange} placeholder='Role' />
                    <input name="minJdSalary" type="number" defaultValue={filters.minJdSalary} className="text-center rounded-lg p-4 mb-2 lg:mb-0 w-[30%] 2xl:[1rem] xl:text-[1rem] md:text-[1rem] sm:text-[0.79rem] text-[0.7rem]" onChange={handleFilterChange} placeholder='Min Pay' />
                </div>
            </div>
            <div>
                <h1 className='mb-6 font-bold 2xl:text-2xl xl:text-xl md:text-[1rem] sm:text-[0.79rem] text-[0.7rem]'>Scroll To See More Jobs</h1>
            </div>
            <div className='flex flex-wrap  2xl:justify-between xl:justify-between lg:justify-between md:justify-between sm:justify-between justify-center w-[100%]' style={{ minHeight: `${minItemsToDisplay * 150}px` }}>
                {data.filter((item) => filterItems(item)).map((job, index) => (
                    <div className='w-[85%] 2xl:w-[30%] 2xl:p-10 xl:w-[30%] xl:p-8 md:w[30%] lg:w-[30%] lg:p-5 md:w-[45%] md:p-4 sm:w-[45%] sm:p-3 border rounded-lg shadow-md mb-4' key={index}>
                        <Card data={job} />
                    </div>
                ))}
            </div>
            {loading && <div>Loading...</div>}
            {reachedEnd && <div>No more data</div>}
            <div className='mb-[100px]'>

            </div>
        </>
    );
}
