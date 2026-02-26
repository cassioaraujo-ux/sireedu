import React from 'react';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportCSV = ({ data, filename = "data.csv" }) => {
    const handleDownload = () => {
        const csvHeaders = Object.keys(data[0]).join(",") + "\n";
        const csvRows = data.map(row =>
            Object.values(row).join(",")
        ).join("\n");

        const csvContent = csvHeaders + csvRows;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownload}
            sx={{
                marginBottom: .5,
                backgroundColor: '#10A37F',
                '&:hover': {
                    backgroundColor: '#12b88e',
                },
            }}
        >
            CSV
        </Button>
    );
};

export default ExportCSV;
