import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const CardSkeleton = () => {
    return (
        <Stack sx={{ margin: '0.5rem' }} spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="h1" sx={{ fontSize: '1.5rem' }} />
            <Skeleton variant="rounded" width={280} height={160} />
        </Stack>
    );
}

export default CardSkeleton;