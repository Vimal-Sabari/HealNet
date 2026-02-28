import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
    );
};

export const CardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-4 flex gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border w-full h-80 flex flex-col">
        <Skeleton className="h-6 w-1/3 mb-6" />
        <div className="flex-1 flex items-end gap-2 px-2">
            <Skeleton className="h-1/2 w-full" />
            <Skeleton className="h-3/4 w-full" />
            <Skeleton className="h-2/3 w-full" />
            <Skeleton className="h-5/6 w-full" />
            <Skeleton className="h-1/2 w-full" />
            <Skeleton className="h-2/3 w-full" />
        </div>
    </div>
);

export default Skeleton;
