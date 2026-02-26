import React from "react";
import { Chart } from "react-google-charts";

const ColumnChart = ({ data, options = {} }) => {
    return (
        <Chart
            chartType="ColumnChart"
            width="100%"
            height="300px"
            data={data}
            options={options} 
        />
    );
}

export default ColumnChart;