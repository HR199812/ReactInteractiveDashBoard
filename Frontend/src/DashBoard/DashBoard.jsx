import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './DashBoard.css';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, Grid,
    TableRow, Typography, TablePagination, TableFooter, Button, Select, MenuItem
} from '@material-ui/core';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import countryList from 'react-select-country-list';



const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const barChartOptions = {
    scales: {
        yAxes: [
            {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
        xAxes: [
            {
                stacked: true,
            },
        ],
    },
};


const useStyles = makeStyles((themes) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: '100%',
        maxWidth: '100%',
        borderRadius: 20
    },
    tableHeaderCell: {
        fontWeight: 'bolder',
        fontSize: 'medium',
        backgroundColor: themes.palette.primary.dark,
        color: themes.palette.getContrastText(themes.palette.primary.dark),
        textAlign: 'center'
    },
    tableDataCell: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 'small',
        cursor: 'pointer',
        color: themes.palette.primary.dark,
    },
    status: {
        fontWeight: 'bold',
        fontSize: '0.75rem',
        color: 'white',
        backgroundColor: 'grey',
        borderRadius: 8,
        padding: '3px 10px',
        display: 'inline-block'
    }
}));


function CofferDataDashBoard() {

    const classes = useStyles();

    const options = useMemo(() => countryList().getData(), []);


    const [dataArrLineForChart, setDataArrLineForChart] = useState([]);
    const [dataArrDoughnutForChart, setDataArrDoughnutForChart] = useState([]);
    const [dataArr, setDataArr] = useState([]);
    const [dataArrCopy, setDataArrCopy] = useState([]);
    const [regionsDataArr, setRegionsDataArr] = useState([]);
    const [topicsDataArr, setTopicsDataArr] = useState([]);
    const [endYearDataArr, setEndYearDataArr] = useState([]);
    const [sourceDataArr, setSourceDataArr] = useState([]);
    const [sectorDataArr, setSectorDataArr] = useState([]);
    const [sectorDataArrForBarChart, setSectorDataArrForBarChart] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const GoToSource = (url) => {
        alert(url);
        window.open('http://domain.com', "_blank");
    };

    const RegionFilter = (e) => {

        const RegionFilterArray = [];

        for (let i = 0; i < dataArr.length; i++) {

            if (dataArr[i].region === e.target.value) {
                RegionFilterArray.push(dataArr[i]);
            }
        }

        setDataArrCopy(RegionFilterArray);

    }
    const TopicFilter = (e) => {

        const TopicFilterArray = [];

        for (let i = 0; i < dataArr.length; i++) {

            if (dataArr[i].topic === e.target.value) {
                TopicFilterArray.push(dataArr[i]);
            }
        }

        setDataArrCopy(TopicFilterArray);

    }
    const ResetTable = (e) => {

        setDataArrCopy(dataArr);

    }

    const CountryFilter = (e) => {

        alert(e.target.value);

        const CountryFilterArray = [];

        for (let i = 0; i < dataArr.length; i++) {

            if (e.target.value === 'United States') {

                dataArr[i].country === 'United States of America' && CountryFilterArray.push(dataArr[i])
            }
            if (dataArr[i].country === e.target.value) {
                CountryFilterArray.push(dataArr[i]);
            }
        }

        setDataArrCopy(CountryFilterArray);

    }
    const EndYearFilter = (e) => {

        alert(e.target.value);

        const EndYearFilterArray = [];

        for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].end_year === e.target.value) {
                EndYearFilterArray.push(dataArr[i]);
            }
        }

        setDataArrCopy(EndYearFilterArray);

    }
    const DataSourceFilter = (e) => {

        alert(e.target.value);

        const EndYearFilterArray = [];

        for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].source === e.target.value) {
                EndYearFilterArray.push(dataArr[i]);
            }
        }

        setDataArrCopy(EndYearFilterArray);

    }
    const SectorFilter = (e) => {

        alert(e.target.value);

        const sectorFilterArray = [];

        for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].sector === e.target.value) {
                sectorFilterArray.push(dataArr[i]);
            }
        }

        setDataArrCopy(sectorFilterArray);

    }

    async function LoadDataFromApi() {
        try {
            const fetchedData = await axios.get('http://localhost:5001/coffer/');

            console.log(fetchedData);

            const regionsArray = fetchedData.data.map(el => el.region).filter((value, index, self) => self.indexOf(value) === index);
            const sourceArray = fetchedData.data.map(el => el.source).filter((value, index, self) => self.indexOf(value) === index);
            const sectorArray = fetchedData.data.map(el => el.sector).filter((value, index, self) => self.indexOf(value) === index);

            const year = (new Date()).getFullYear();
            const years = Array.from(new Array(40), (val, index) => index + year);

            const topicsData = fetchedData.data.reduce((acc, o) => (acc[o.topic] = (acc[o.topic] || 0) + 1, acc), {});
            const endYearData = fetchedData.data.reduce((acc, o) => (acc[o.end_year] = (acc[o.end_year] || 0) + 1, acc), {});
            const sectorDataArray = fetchedData.data.reduce((acc, o) => (acc[o.sector] = (acc[o.sector] || 0) + 1, acc), {});

            console.log(sectorDataArray);

            const lineChartData = {
                labels: [...Object.keys(topicsData)],
                datasets: [
                    {
                        label: '#No of Topics Occurences',
                        data: [...Object.values(topicsData)],
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                ],
            };


            const doughnutChartData = {
                labels: [...Object.keys(endYearData)],
                datasets: [
                    {
                        label: 'Data according to End-Year',
                        data: [...Object.values(endYearData)],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            const BarChartData = {
                labels: [...Object.keys(sectorDataArray)],
                datasets: [
                    {
                        label: '# Data according to sectors',
                        data: [...Object.values(sectorDataArray)],
                        backgroundColor: 'rgb(255, 99, 132)',
                    }
                ],
            };

            setDataArr(fetchedData.data);
            setDataArrCopy(fetchedData.data);

            setRegionsDataArr(regionsArray);
            setTopicsDataArr(Object.keys(topicsData));
            setEndYearDataArr(years);
            setSourceDataArr(sourceArray);
            setDataArrLineForChart(lineChartData);
            setDataArrDoughnutForChart(doughnutChartData);
            setSectorDataArr(Object.keys(sectorDataArray));
            setSectorDataArrForBarChart(BarChartData);

        } catch (error) {

        }
    }

    useEffect(() => {
        LoadDataFromApi();
    }, []);

    return (
        <>
            <div>
                <div className='filterBar'>
                    <h1>Filters</h1>
                    <p>By Country:&nbsp;&nbsp;
                        <select className="UserCountry" onChange={CountryFilter}>
                            {
                                options.map((option) => {
                                    return (
                                        <option value={option.label}>{option.label}</option>
                                    );
                                })
                            }
                        </select>

                        &nbsp;&nbsp;&nbsp;&nbsp;

                        By Topics:&nbsp;&nbsp;
                        <select className="DataTopics" onChange={TopicFilter}>
                            {
                                topicsDataArr.map((option) => {
                                    return (
                                        <option value={option}>{option}</option>
                                    );
                                })

                            }
                        </select>

                        &nbsp;&nbsp;&nbsp;&nbsp;

                        By Region:&nbsp;&nbsp;
                        <select className="DataRegion" onChange={RegionFilter}>
                            {
                                regionsDataArr.map((option) => {
                                    return (
                                        <option value={option}>{option}</option>
                                    );
                                })

                            }
                        </select>

                        &nbsp;&nbsp;&nbsp;&nbsp;

                        By End Year:&nbsp;&nbsp;
                        <select className="EndYear" onChange={EndYearFilter}>
                            {
                                endYearDataArr.map((year, index) => {
                                    return <option key={`year${index}`} value={year}>{year}</option>
                                })
                            }
                        </select>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="contained" onClick={ResetTable}>Reset All</Button>
                    </p>


                    <p>

                        By Sector:&nbsp;&nbsp;
                        <select className="DataSector" onChange={SectorFilter}>
                            {
                                sectorDataArr.map((sector, index) => {
                                    return <option>{sector}</option>
                                })
                            }
                        </select>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        By Source:&nbsp;&nbsp;
                        <select className="DataSource" onChange={DataSourceFilter}>
                            {
                                sourceDataArr.map((option) => {
                                    return (
                                        <option value={option}>{option}</option>
                                    );
                                })

                            }
                        </select>
                    </p>

                </div>
                <TableContainer component={Paper} className={classes.container} >
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableHeaderCell}>Sr. No</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Sector</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Topic</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Pestle</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Source</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Intensity</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Likelihood</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Relevance</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Country</TableCell>
                                <TableCell className={classes.tableHeaderCell}>Region</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataArrCopy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                                    return (
                                        <TableRow key={index} onClick={() => GoToSource(data.url)}>
                                            <TableCell className={classes.tableDataCell}>{index + 1}</TableCell>
                                            {
                                                data.sector ?
                                                    <TableCell className={classes.tableDataCell}>{data.sector}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.topic ?
                                                    <TableCell className={classes.tableDataCell}>{data.topic}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.pestle ?
                                                    <TableCell className={classes.tableDataCell}>{data.pestle}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.source ?
                                                    <TableCell className={classes.tableDataCell}>{data.source}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A <i class="fa fa-external-link"></i></TableCell>
                                            }
                                            {
                                                data.intensity ?
                                                    <TableCell className={classes.tableDataCell}>{data.intensity}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.likelihood ?
                                                    <TableCell className={classes.tableDataCell}>{data.likelihood}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.relevance ?
                                                    <TableCell className={classes.tableDataCell}>{data.relevance}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.country ?
                                                    <TableCell className={classes.tableDataCell}>{data.country}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {
                                                data.region ?
                                                    <TableCell className={classes.tableDataCell}>{data.region}</TableCell> :
                                                    <TableCell className={classes.tableDataCell}>N/A</TableCell>
                                            }
                                            {/* <TableCell className={classes.tableDataCell}>{data.city}</TableCell> */}
                                        </TableRow>

                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                    <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[5, 10]}
                            component="div"
                            count={dataArr.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableFooter>
                </TableContainer>
            </div >

            <div style={{ display: 'block' }}>
                <div style={{ width: '50%', height: '50%', float: 'left' }}>
                    <Line data={dataArrLineForChart}
                        options={options} />
                </div>
                <div style={{ width: '30%', height: '30%', float: 'left' }}>
                    <Doughnut data={dataArrDoughnutForChart} />
                </div>
            </div>
            <Bar data={sectorDataArrForBarChart} options={barChartOptions} />
        </>
    );
}

export default CofferDataDashBoard;