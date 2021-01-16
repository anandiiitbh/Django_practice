import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});



export default function TableFetch(props) {
    const classes = useStyles();

    function setRow() {
        let key = Object.keys(props.data[0].data);
        return key.map(val => (
            <TableRow key={val}>
                <TableCell component="th" key={val + '1'} scope="row">{val}</TableCell>
                {props.data.map(dat => (
                    <TableCell key={dat.data[val]} align="right">{dat.data[val] === null ? 'Null' : dat.data[val]}</TableCell>
                ))}
            </TableRow>
        ))
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="caption table">
                <caption>A basic table example with a caption</caption>
                <TableHead>
                    <TableRow>
                        <TableCell>Comparable Data</TableCell>
                        {props.data.map(val => {
                            return <TableCell key={val} align="right">{val.city[0].toUpperCase() + val.city.substring(1) + " " + val.state}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {setRow()}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
