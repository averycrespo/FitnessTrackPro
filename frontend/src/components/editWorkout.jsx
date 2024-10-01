import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import '../static/css/styles.css';
import { Box, Modal,Typography, TextField, Button, Select, MenuItem } from  '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid } from '@mui/x-data-grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../static/css/styles.css'
import useFetch from 'react-fetch-hook';

function EditWorkout({customTheme}) {
  const [open, setOpen] = useState(false);
  const {state} = useLocation();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(dayjs());
  const [rows, setRows] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [exercise, setExercise] = useState('');
  const [numSets, setNumSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [idCounter, setIdCounter] = useState(0);
  const [selected, setSelected] = useState([]);
  const [dateChanged, setDateChanged] = useState(false);
  const { error: wErr, data: wData} = useFetch(`/api/workouts/${state}`);
  const { data: iData, isLoading: iIsLoading } = useFetch(`/api/items/${state}`);
  const { data: eData, isLoading: eIsLoading } = useFetch('/api/exercise/');
  const { data: userData, isLoading: userIsLoading } = useFetch('/api/users/current/');
  const navigate = useNavigate();
  document.title = "Edit Workout";

  useEffect(() => {
    //User not logged in
    if (wErr && wErr.status === 401) {
        navigate('/login');
    } else {
      if(!iIsLoading) {
        console.log(iData);
        let items = iData;
        console.log(items && items.length > 0);
        if(items && items.length > 0) {
            let sortedRows = items.map((result, i) => ({
                id: i,
                item_id: result.item_id,
                workout_id: result.workout_id,
                exercise_name: result.exercise_name,
                sets: result.sets,
                reps: result.reps,
                weight: result.weight
            }));
            setRows(sortedRows);
            setIdCounter(sortedRows.length);
        }
      }
      if(!eIsLoading) {
        console.log(eData);
        if(eData && eData.exercise) {
          setExerciseList(eData.exercise);
        }
      }
    }
  }, [iIsLoading, eIsLoading, wErr, state]);

  const cols = [
    {
        field: 'exercise_name',
        headerName: 'Exercise',
        headerClassName: 'view-item-header',
        width: 200,
        editable: true,
    },
    {
        field: 'sets',
        headerName: 'Sets',
        headerClassName: 'view-item-header',
        width: 100,
        editable: true,
    },
    {
      field: 'reps',
      headerName: 'Reps',
      headerClassName: 'view-item-header',
      width: 100,
      editable: true
  },
  {
    field: 'weight',
    headerName: 'Weight',
    headerClassName: 'view-item-header',
    width: 100,
    editable: true
  },
];

  const handleDateChange = (newValue) => {
    setDate(newValue);
    setDateChanged(true);
  };
  
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
      setIsVisible(!isVisible);
  };

  //exercise item
  // const [sets, setSets] = useState([['', '', '', '']]);

  // //placeholders for exercise
  // const placeholders = ['Exercise', 'Sets', 'Reps', 'Weight'];

  // //add an exercise set
  // const addSet = () => {
  //     setSets([...sets, ['', '', '', '']]);
  // };

  // //remove exercise
  // const removeSet = (index) => {
  //     const updatedSets = sets.filter((_, i) => i !== index);
  //     setSets(updatedSets);
  //   };
  
    // const addInputLine = (index) => {
    //   const updatedSets = [...sets];
    //   updatedSets[index] = [...updatedSets[index], ''];
    //   setSets(updatedSets);
    // };
  
    // const removeInputLine = (setIndex, inputIndex) => {
    //   const updatedSets = [...sets];
    //   updatedSets[setIndex] = updatedSets[setIndex].filter((_, i) => i !== inputIndex);
    //   setSets(updatedSets);
    // };
  
    const handleInputChange = (setIndex, inputIndex, value) => {
      const updatedSets = [...sets];
      updatedSets[setIndex][inputIndex] = value;
      setSets(updatedSets);
    };

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

    //responsible for PUT
    const saveWorkout = async () => {
      try {
        let statusNameDate = await saveNameDate();
        let statusItems = await saveItems();
        // let statusExerciseItems;
        if( statusNameDate && statusItems) {
          toast.success("Successfully updated workout");
        } else {
          toast.error("Error updating workout");
        }
        
      } catch (error) {
        console.error("error during save");
      }
    }

    const saveNameDate = async () => {
      //If user changed name
      let bodyName;
      if( !name ) {
        bodyName = wData.workout[0].workout_name;
      } else {
        bodyName = name;
      }
      
      //If user changed date
      let newDate = wData.workout[0].workout_date;
      if (dateChanged) {
          newDate = editDate(date);
      } else {
        const parseDate = dayjs(newDate);
        newDate = parseDate.format('YYYY-MM-DD HH:mm:ss'); 
      }

      let workoutId = await state;

      //FETCH request for PUT
      let prom = await fetch(`/api/workouts/${state}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: workoutId,
          name: bodyName,
          date: newDate,
        }),
      })
      .catch((err) => {
          alert('Error using PUT');
          res.text().then((result) => console.log(result));
      })
      //Return Success
      // navigate('/editWorkout'); 
      return { success: true, message: 'Workout updated successfully' };
    }

    const saveItems = async () => {
      await fetch( `/api/items/workout/${state}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({}),
      })
      .then(() => {
        rows.forEach(item => {
          fetch( '/api/items/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              workoutId: state,
              exerciseName: item.exercise_name,
              sets: item.sets,
              reps: item.reps,
              weight: item.weight
            }),
          })
          .then(() => {
            console.log(userData);
            fetch( '/api/exercise', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                userId: userData.id,
                exerciseName: item.exercise_name,
                best: item.weight
              }),
            })
            .catch((err) => {
              alert('Error updating PR Table');
              return;
            })
          })
          .catch((err) => {
            alert('Error using adding item');
            return;
          })
        })
      })
      .catch((err) => {
        alert('Error using updating databse');
        return;
      })
      return { success: true, message: 'Workout updated successfully' };
    }

    const addExercise = () => {
      if(exercise === '') {
        alert('Must Select an Exercise');
        e.preventDefault();
      } else {
        let temp = [
          ...rows,
          {
            id: idCounter,
            item_id: -1,
            workout_id: state,
            exercise_name: exercise,
            sets: numSets,
            reps: reps,
            weight: weight
          }
        ];
        setRows(temp);
        setIdCounter((prev) => prev + 1);
        handleClose();
      }
    }

    const removeItem = () => {
      let r = rows;
      selected.forEach((item) => {
        r = r.filter((row) => row.id != item.id);
        console.log(r);
      })
      setRows(r);
    }

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const rowsSelectionHandler = (ids) => {
      const itemList = ids.map((id) => rows.find((row) => row.id === id));
      setSelected(itemList);
    }

    const handleCellEditCommit = React.useCallback(
      ({ id, field, value }) => {
        const updatedRows = rows.map((row) => {
          if(row.id === id) {
            return {...row, value};
          }
          return row;
        });
        setRows(updatedRows);
      },
      [rows],
    );

    //FETCH for workout items
    // const statusExerciseItems = async () => {
      
    // }

    return (
        <>
          <Modal open={open} onClose={handleClose}>
              <Box
              sx={{
                  maxWidth: '40%',
                  maxHeight: '10%',
                  backgroundColor: customTheme.palette.background.default,
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
                      backgroundColor: customTheme.palette.background.default,
                      }}>
                      <Select
                          id='exercise'
                          label='Exercise'
                          variant='filled'
                          value={exercise}
                          onChange={(e) => setExercise(e.target.value)}
                      >
                        {
                          !eIsLoading ? Object.values(exerciseList).map((ex) => {
                            return <MenuItem value={ex.exercise_name}>{ex.exercise_name}</MenuItem>
                          }) : <MenuItem>Exercises Loading</MenuItem>
                        }
                      </Select>
                      <TextField
                          id="sets"
                          label="Sets"
                          type="number"
                          variant='filled'
                          onChange={(e) => setNumSets(e.target.value)}
                      />
                      <TextField
                          id="reps"
                          label="Reps"
                          type="number"
                          variant='filled'
                          onChange={(e) => setReps(e.target.value)}
                      />
                      <TextField
                          id="weight"
                          label="Weight"
                          type="number"
                          variant='filled'
                          onChange={(e) => setWeight(e.target.value)}
                      />
                      <Box sx={{ backgroundColor: customTheme.palette.background.default }}>
                          <Button
                          variant='h6'
                          sx={{
                              backgroundColor: '#04BE00',
                              maxWidth: '25%',
                          }}
                          onClick={addExercise}>
                          Submit
                          </Button>
                      </Box>
                  </Box>
              </Box>
          </Modal>
          <div style={{width: '100%', height: '75px', backgroundColor: customTheme.palette.secondary.main, display: 'flex'}}>
              <ToastContainer/>
              <div style={{borderStyle: 'none solid none none', borderRightWidth: '5px', borderColor: customTheme.palette.background.default, marginRight: '10px'}}>
                  <Link to="/viewWorkouts" style={{ textDecoration: 'none' }}>
                    <HomeIcon sx={{color: customTheme.palette.primary.main, fontSize: 'xx-large', marginRight: '10px', marginTop: '20px'}}></HomeIcon>
                  </Link>
              </div>
              <Typography level="h2" component="h2" 
                  sx={{
                      alignSelf: 'center',
                      fontFamily: '"Bungee Shade", sans-serif',
                      fontWeight: '400',
                      color: customTheme.palette.primary.main,
                      WebkitTextStroke: '1px black',
                      fontSize: 'calc(3vw + 2vh)',
                  }}>
                  <b>Edit Workout</b>
              </Typography>

          </div>

          {/* <FormControl sx={{ display: 'flex', flexDirection: 'column', paddingTop: '40px', }}> */}
          <div className="add-workout-header-spacing"> 
            <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>            
              <div style={{maxWidth: '250px', paddingLeft: '20px', paddingBottom: '20px', color: customTheme.palette.primary.main}}>
              {/* New Workout Name: */}
              <TextField
                    id='name'
                    label="Enter New Workout Name"
                    placeholder={wData && wData.workout && wData.workout[0] ? wData.workout[0].workout_name : 'New Name'}
                    variant='filled'
                    onChange={(e) => setName(e.target.value)}
              />
              </div>

              <div style={{maxWidth: '140px', paddingLeft: '20px'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        value= {null}
                        onChange={(newValue) => handleDateChange(newValue)}
                    />
                  </LocalizationProvider>
                </div>
              </Box>
          </div>
              
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
                    onCellEditCommit={handleCellEditCommit}
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
                    onClick={removeItem}>
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


            {/* Logout bottom left */}
          <div className="logout-button">
            <footer style={{ marginTop: 'auto' }}>
              <Button 
                      variant="outlined"  /* should just make this an asset considering that this will be used everywhere */
                      size="large"
                      sx={{
                          mt: 1,
                          backgroundColor: '#ccc',
                          padding: '15px 30px',
                          fontSize: 'calc(1vw + 1vh)',
                          color: 'black',
                          WebkitTextStroke: 'px black',
                          border: `2px solid black`,
                          transition: 'background-color 0.5s ease, -webkit-text-stroke 0.3s ease',
                          '&:hover': {
                              backgroundColor: customTheme.palette.primary.main,
                              
                            },
                        }}
                        onClick={saveWorkout}
                  >
                  Save
                </Button>
              </footer>
          </div>

        </>
    );

}

export default EditWorkout;