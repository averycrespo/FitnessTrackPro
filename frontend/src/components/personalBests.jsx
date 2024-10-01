
import React, { useState, useEffect } from "react";
// import { ThemeProvider } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import CssBaseline from '@mui/material/CssBaseline'
import HomeIcon from '@mui/icons-material/Home';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'; 
import '../static/css/styles.css'
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../static/css/styles.css'

function PersonalBests({customTheme}) {
    const navigate = useNavigate();
    let flag = false;

    //run once when the page loads 
    useEffect(() => {
        document.title = "Personal Bests";
        fetchUser();

        if(!navigator.onLine) {
            navigate('/offline');
        }
    }, []);

    const [list, setList] = useState([]);
    const [rows, setRows] = useState([]);
    const [userData, setUserData] = useState(null);
    const [tableContent, setTableContent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const fetchUser = async () => {
        try {
            const response = await fetch('api/users/current', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json', 
                }
                });
            
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const fetchUserData = await response.json();
                if (fetchUserData && fetchUserData.id && fetchUserData.username) {
                    setUserData(fetchUserData);
                    await displayUsersBests(fetchUserData);
                } else {
                    console.error('User data is null / undefined');
                    navigate('/login');
                }
                } catch (error) {
                    console.error('Error fetching user:', error.message);
                    navigate('/login');
                  throw error;
                }
    };

    const cols = [
        {
            field: 'exercise_name',
            headerName: 'Exercise',
            headerClassName: 'view-exercises-header',
            width: 200,
            editable: true,
            sortable: true,
        },
        {
            field: 'best',
            headerName: 'Weight (lbs)',
            headerClassName: 'view-exercises-header',
            width: 500,
            editable: true,
            sortable: true,
        },
    ];

    const displayUsersBests = async (userData) => {
        try {
            const response = await fetch(`api/exercise/${userData.id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json', 
                }
                });
            if (!response.ok) {
                throw new Error('Failed to fetch user data', response.status);
            }
            const listData = await response.json();
            if (listData) {
                console.log(listData);
                setList(listData);
                flag = true;
                setRows(listData.exercise.map((item, i) => ({
                    id: i,
                    exercise_name: item.exercise_name,
                    best: item.best
                })));
                //setTableContent(renderRows(listData));
            } else {
                console.error('Need to adjust for empty user and display');
            }
            } catch (error) {
                console.error('Error fetching exercise:', error.message);
                throw error;
            }
    }


    const renderRows = (data) => {
        return data.exercise.map((item, index) => (
            <TableRow key={index}>
                <TableCell>
                    <div style={{ marginRight: '10px' }}>{item.exercise_name}</div>
                </TableCell>
                <TableCell>
                    <div style={{ marginLeft: '10px' }}>{item.best}</div>
                </TableCell>
            </TableRow>
        ));
    }

    const searchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filterList = list.exercise ? list.exercise.filter(item =>
        item.exercise_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <>
            <div style={{width: '100%', height: '75px', backgroundColor: customTheme.palette.secondary.main, display: 'flex'}}>
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
                    <b>Personal Bests</b>
                </Typography>
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
                            pageSize: 15,
                            },
                        },
                    }}
                    pageSizeOptions={[15]}
                />
            </Box>
        </>
    )
}

export default PersonalBests;