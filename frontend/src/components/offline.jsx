import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import useFetch from 'react-fetch-hook';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Modal, TextField, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../static/css/styles.css'

function Offline ({customTheme}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [date, setDate] = useState(dayjs());
    const [rows, setRows] = useState([]);
    const [color, setColor] = useState(customTheme.palette.background.default)
    const [idCounter, setIdCounter] = useState(0);
    const [selected, setSelected] = useState([]);
    const [type, setType] = useState('');
    const navigate = useNavigate();
    const { error, data, isLoading } = useFetch('/api/users/current/');
    const { error: wErr, data: wData, isLoading: wIsLoading } = useFetch(`/api/workouts/`);
    
    let newWorkoutsToAdd = [];

    const compareFn = (w1, w2) => {
        if(dayjs(w1.workout_date).isBefore(dayjs(w2.workout_date))) {
            return 1;
        } else if(dayjs(w1.workout_date).isAfter(dayjs(w2.workout_date))) {
            return -1;
        } else {
            return 0;
        }
    }

    document.title = "Offline";
    let addWorkoutList = [];


    useEffect(() => {
        
        if (navigator.onLine) {
            console.log("online");
            const storedWorkouts = localStorage.getItem('workouts');
            console.log('local stroage: ', storedWorkouts);

            //local storage used
            if(storedWorkouts) {
                const arr = JSON.parse(storedWorkouts)
                console.log('ran through');
                    try {
                        arr.forEach( async (workout) => {
                        console.log(workout);
                        const response = await fetch(`api/workouts/`, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                usr_id: workout.usr_id,
                                name: workout.workout_name,
                                date: workout.workout_date
                            })
                        });
                        if (!response.ok) {
                            alert('Error adding workout');
                            const result = await response.text();
                            console.log(result);
                        }
                    }) 
                    } catch (err) {
                        console.log(err);
                    }
                    navigate('/viewWorkouts');
            }
        }
                
            if (!wIsLoading) {
                let workouts = Object.values(wData)[0];
                // console.log(workouts && workouts.length > 0);
                if(workouts && workouts.length > 0) {
                    let sortedRows = workouts.map((result, i) => ({
                        id: i,
                        workout_id: result.workout_id,
                        usr_id: result.usr_id,
                        workout_name: result.workout_name,
                        workout_date: result.workout_date
                    }));
                    sortedRows.sort(compareFn);

                    setRows(sortedRows);
                    setIdCounter(sortedRows.length);
                }
                console.log(rows);
            }
      }, [isLoading, wIsLoading]);

    const cols = [
        {
            field: 'workout_name',
            headerName: 'Workout',
            headerClassName: 'view-workouts-header',
            width: 200,
            editable: true,
            sortable: true,
        },
        {
            field: 'workout_date',
            headerName: 'Date',
            headerClassName: 'view-workouts-header',
            width: 200,
            editable: true,
            sortable: true,
        },
    ];

    //Edit date to fit SQL 
    const editDate = (date) => {
        if (dayjs.isDayjs(date)) {
            const newDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss'); 
            return newDate;
        } else {
            console.error('Invalid Date:', date);
            return date; 
        }
    }
    
    const addWorkout = async () => {
      let newDate = editDate(date);
      const { workouts } = wData;
      let nextId = Math.max(...workouts.map(workout => workout.workout_id));
      nextId += 1;
      
      const newWorkout = {  
          id: idCounter,
          workout_id: nextId,
          usr_id: data.id,
          workout_name: name,
          workout_date: newDate,
        };

        console.log('New Workout:', newWorkout);
        
        let sortedRows = [
          ...rows,
          newWorkout
        ];
        sortedRows.sort(compareFn);
        setRows(sortedRows);
        setIdCounter((prev) => prev + 1);
        setName('');
        setType('');
        handleClose();
        addWorkoutList = [...addWorkoutList , newWorkout];
        localStorage.setItem('workouts', JSON.stringify(addWorkoutList));
  };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const rowsSelectionHandler = (ids) => {
        const workoutList = ids.map((id) => rows.find((row) => row.id === id));
        setSelected(workoutList);
        console.log(Object.values(workoutList));
    }

    const removeWorkout = async () => {
        let promises = [];
        console.log("deleting: ", selected);
        //Do promise all to create promises for all deletes. Once they resolve filter out the row list
        for(let workout of selected) {
            let prom = fetch(`/api/workouts/${workout.workout_id}`, {
                method: 'DELETE',
            })
            promises.push(prom);
        }
        Promise.all(promises).then(() => {
            let r = rows;
            selected.forEach((workout) => {
                console.log(workout.workout_id);
                r = r.filter((row) => row.workout_id != workout.workout_id);
                console.log(workout.workout_id, r);
            })
            console.log( r);
            setRows(r);
            newWorkoutList = r;
        })
        .catch((err) => {
            alert('Error removing workouts');
            res.text().then((result) => console.log(result));
        })
    }

    const handleRowClick = (params) => {
        //navigate('/editWorkout', {state: params.row.workout_id});
    }

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                sx={{
                    maxWidth: '40%',
                    maxHeight: '10%',
                    backgroundColor: color,
                    boxShadow: 24,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '30%',
                    marginTop: '20%',
                    position: 'absolute',
                }}>
                    <Typography variant='h5'>Create Workout</Typography>
                    <Box
                        sx={{
                        display: 'flex',
                        backgroundColor: color,
                        }}>
                        <TextField
                            id='name'
                            label='Name'
                            variant='filled'
                            onChange={(e) => setName(e.target.value)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
                            />
                        </LocalizationProvider>
                    <Box sx={{ backgroundColor: color }}>
                        <Button
                        variant='h6'
                        sx={{
                            backgroundColor: '#04BE00',
                            maxWidth: '25%',
                        }}
                        onClick={addWorkout}>
                        Submit
                        </Button>
                    </Box>
                    </Box>
                </Box>
            </Modal>
            <Box style={{width: '100%', height: '75px', backgroundColor: customTheme.palette.secondary.main, display: 'flex'}}>
                
                <Typography level="h2" component="h2" 
                    sx={{
                        alignSelf: 'center',
                        marginLeft: '10px',
                        fontFamily: '"Bungee Shade", sans-serif',
                        fontWeight: '400',
                        marginRight: '5%',
                        color: customTheme.palette.primary.main,
                        WebkitTextStroke: '1px black',
                        fontSize: 'calc(3vw + 2vh)',
                    }}>
                    <b>Offline Mode</b>
                </Typography>
            </Box>

            <Box 
                sx={{ 
                    height: 400,
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginLeft: '25%',
                    marginTop: '30px',
                    backgroundColor: customTheme.palette.secondary.main
                }}>
                <DataGrid
                    rows={rows}
                    columns={cols}
                    onRowClick={handleRowClick}
                    initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    checkboxSelection={true}
                    onRowSelectionModelChange={(ids) => rowsSelectionHandler(ids)}
                />
            </Box>
            <Box sx={{display: 'flex', maxHeight: '30%', alignContent: 'center', justifyContent: 'center'}}>
                <Button 
                    variant='h6' 
                    sx={{
                        backgroundColor: '#04BE00',
                        fontSize: 'large',
                        maxHeight: '50%',
                        marginTop: '5px'
                    }} 
                    onClick={removeWorkout}>
                    <DeleteForeverIcon />
                </Button>
                <Button 
                    variant='h6' 
                    sx={{
                        backgroundColor: '#04BE00',
                        fontSize: 'large',
                        marginLeft: '5%',
                        maxHeight: '50%',
                        marginTop: '5px'
                    }} 
                    onClick={handleClickOpen}>
                        +
                </Button>
            </Box>
            
        </>
    );
}

export default Offline;