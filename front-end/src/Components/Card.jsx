import {useState} from 'react';
export default function Card(props){
    // const data = {"jdLink":"https://weekday.works","jobDetailsFromCompany":"This is a sample job and you must have displayed it to understand that its not just some random lorem ipsum text but something which was manually written. Oh well, if random text is what you were looking for then here it is: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and now in this assignment.","maxJdSalary":61,"minJdSalary":null,"salaryCurrencyCode":"USD","location":"delhi ncr","minExp":3,"maxExp":6,"jobRole":"frontend","companyName":"Dropbox","logoUrl":"https://logo.clearbit.com/dropbox.com"};
    const [expanded, setExpanded] = useState(false);
    const data = props.data;

    const toggleDescription = () => {
        setExpanded(!expanded);
    };
    return (
        <div className="flex flex-col items-start">
            <div className="flex flex-row">
                <div className="flex flex-col w-[30%]">
                    <img src={data.logoUrl} alt="logo"/>
                </div>
                <div className="flex flex-col justify-between w-[60%] pl-4">
                    <span className="text-left font-bold">{data.companyName}</span>
                    <span className="text-left">{data.jobRole}</span>
                    <span className='text-left'>{data.location}</span>
                </div>  
            </div>
            <span className="mt-2">Estimated Salary: 
                {
                    data.minJdSalary && data.maxJdSalary?
                    <>
                         {data.salaryCurrencyCode} {data.minJdSalary} - {data.maxJdSalary} LPA
                    </>:
                    data.minJdSalary?
                    <>
                        Min- {data.salaryCurrencyCode} {data.minJdSalary} LPA
                    </>:
                    data.maxJdSalary?
                    <>
                        Max- {data.salaryCurrencyCode} {data.maxJdSalary} LPA
                    </>:
                    <>
                        No Salary Details
                    </>
                }
            </span>   
            <span>
                Job Details
            </span>
            <div className="flex flex-col items-center">
                <span className='text-left'>
                    {expanded ? data.jobDetailsFromCompany : `${data.jobDetailsFromCompany.slice(0, 200)}...`}
                </span>
                {data.jobDetailsFromCompany.length > 100 && (
                        <button className="text-blue-500 w-[50%] font-semibold focus:outline-none" onClick={toggleDescription}>
                            {expanded ? 'View Less' : 'View More'}
                        </button>
                    )}
            </div>
            <span>Experience Required</span>
            <span>
                {
                    data.minExp && data.maxExp?
                    <>{data.minExp} to {data.maxExp} years</>:
                    data.minExp?
                    <>Minimum : {data.minExp} years</>:
                    data.maxExp?
                    <>
                        Maximum : {data.maxExp} years
                    </>:
                    <>
                        No details
                    </>
                }
            </span>
            <div className='flex justify-center w-[100%]'>
                <button className='w-[50%]'>
                    Easy Apply
                </button>
            </div>
        </div>
    );
}