import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import TableFetch from './components/Table';
import "./App.css";


function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function App() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [keyword, setKeyword] = useState('');
  const loading = open && options.length === 0;
  const [cities, setCities] = useState([]);
  const [displayTable, setDisplayTable] = useState([]);

  const [state, setState] = useState({
    crime: true,
    sunshine: true,
    temp_high: true,
    temp_low: true,
    rent: true
  });



  function getTable() {
    if (Array.isArray(cities) && cities.length && cities.length < 6) {
      let count = 0;
      let items = '';
      for (let key in state) {
        if (state[key]) {
          items = count ? items + ',' : '';
          items = items + key;
          count++;
        }
      }
      if (count > 0) {
        let location = [];
        cities.map((data) => {
          let raw = data.split(", ");
          location.push({ city: raw[0], state: raw[1] });
          return raw;
        });

        var raw = JSON.stringify({ parameters: items, locations: location });
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw
        };


        fetch("/api/v1/locations/compare_cities/", requestOptions)
          .then(response => response.json())
          .then(result => setDisplayTable(result.data))
          .catch(error => console.log('error', error));
      }
      else {
        swal("Bad Request!", "You have to select an Item to fetch data! Let's Choose {Crime} ", "error");
        setState({ ...state, crime: true });
      }
    }
    else {
      swal("Bad Request!", "You have to select Minimum 1 and Maximum 5 cities!", "error");
      setOpen(true);
    }
  }


  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch('/api/v1/auto_complete/location/?q=' + keyword.toLowerCase());
      await sleep(100);
      const countries = await response.json();

      if (active) {
        setOptions(Object.keys(countries.items).map((key) => countries.items[key]));
      }
    })();

    return () => {
      active = false;
    };
  });

  async function Togg() {
    setOpen(false);
    await sleep(1e3);
    setOpen(true);
  }
  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div className="app">
      <div className="header">
        <h2>Statistics</h2>
      </div>
      <div className={classes.root}>
        <Autocomplete
          multiple
          limitTags={2}
          open={open}
          onChange={(event, value) => setCities(value)}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={(option) => option}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <CssTextField
              {...params}
              onChange={(data) => { setKeyword(data.target.value); Togg(); }}
              variant="outlined"
              label="Select City"
              className="cityy"
              // onChange={(data) => { getApi(data.nativeEvent.data); console.log(data); }}
              placeholder="Select...."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </div>
      <div style={{ margin: "auto", marginTop: "5px", marginBottom: "5px", width: '70%' }}>
        <FormControlLabel
          style={{ color: "white" }}
          control={
            <Checkbox
              checked={state.crime}
              onChange={handleChange}
              name="crime"
            />
          }
          label="Crime"
        />
        <FormControlLabel
          style={{ color: "white" }}
          control={
            <Checkbox
              checked={state.sunshine}
              onChange={handleChange}
              name="sunshine"
            />
          }
          label="Sunshine"
        />
        <FormControlLabel
          style={{ color: "white" }}
          control={
            <Checkbox
              checked={state.temp_high}
              onChange={handleChange}
              name="temp_high"
            />
          }
          label="High Temp"
        />
        <FormControlLabel
          style={{ color: "white" }}
          control={
            <Checkbox
              checked={state.temp_low}
              onChange={handleChange}
              name="temp_low"
            />
          }
          label="Low Temp"
        />
        <FormControlLabel
          style={{ color: "white" }}
          control={
            <Checkbox
              checked={state.rent}
              onChange={handleChange}
              name="rent"
            />
          }
          label="rent"
        />


        <ColorButton variant="contained" color="primary" onClick={() => getTable()}>
          Get Details
      </ColorButton>
      </div>
      <div style={{ margin: 'auto', width: '80%' }} >
        {Array.isArray(displayTable) && displayTable.length ? <TableFetch data={displayTable} /> : ''}
      </div>
    </div>
  );
}

export default App;


const ColorButton = withStyles((theme) => ({
  root: {
    width: '150px',
    margin: 'auto',
    marginTop: '5px',
    marginLeft: "15px",
    color: theme.palette.getContrastText('rgba(113 119 144 / 45%)'),
    backgroundColor: 'rgba(113 119 144 / 75%)',
    '&:hover': {
      backgroundColor: 'rgba(113 119 144 / 30%)',
    },
  },
}))(Button);


const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "10px",
    marginBottom: "5px",
    backdropFilter: "blur(20px)",
    borderRadius: "5px",
    width: "80%",
    "& > * + *": {
      marginTop: theme.spacing(3)
    }
  },
  icon: {
    color: "white"
  }
}));

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "white"
    },
    "& label": {
      color: "white"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white"
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "rgba(113 119 144 / 45%)",
        borderWidth: "2px"
      },
      "&:hover fieldset": {
        borderColor: "rgba(113 119 144 / 10%)"
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(113 119 144 / 20%)"
      }
    }
  }
})(TextField);