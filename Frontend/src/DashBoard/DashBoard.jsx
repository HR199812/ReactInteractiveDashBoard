import { useState, useEffect } from 'react';
import axios from 'axios';
import './DashBoard.css';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, Grid,
    TableRow, Typography, TablePagination, TableFooter, Button, Select, MenuItem
} from '@material-ui/core';

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

    const [dataArr, setDataArr] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const ViewCard = (data) => {
        console.log('Hi')
        console.log(data);
    };

    async function LoadDataFromApi() {
        try {
            const fetchedData = await axios.get('http://localhost:5001/coffer/');

            console.log(fetchedData);

            setDataArr(fetchedData.data);

        } catch (error) {

        }
    }

    useEffect(() => {
        LoadDataFromApi();
    }, []);

    return (
        <div>
            <div className='filterBar'>
                <input type='text' placeholder='search' /><Button variant="contained">Search</Button>
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
                            dataArr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                                return (
                                    <TableRow key={index} onClick={() => ViewCard(data)}>
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
                                                <TableCell className={classes.tableDataCell}>N/A</TableCell>
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
    );
}

export default CofferDataDashBoard;