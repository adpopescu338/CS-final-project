import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from 'src/contexts';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { req } from 'src/fe-lib/Req';
import { useMutation } from 'react-query';

export const Navbar = () => {
  const session = useSession();
  const navigate = useNavigate();

  const buttonSize = 'small';

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = useMutation(req.logout);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <img src="/logo512.png" alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
            </Grid>

            <Grid item xs>
              <Grid container spacing={2}>
                <Grid item>
                  <Link to="/">
                    <Button color="secondary" variant="contained" size={buttonSize}>
                      Home
                    </Button>
                  </Link>
                </Grid>
                {session.user && (
                  <Grid item>
                    <Link to="/dashboard">
                      <Button color="secondary" variant="contained" size={buttonSize}>
                        Dashboard
                      </Button>
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item>
              {session.user ? (
                <div>
                  <Avatar onClick={handleClick}>U</Avatar>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={(e) => {
                        handleClose();
                        navigate('/settings');
                      }}
                    >
                      Settings
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/');
                        logout.mutate();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <Grid container spacing={2}>
                  <Grid item>
                    <Link to="/signin">
                      <Button color="secondary" variant="contained" size={buttonSize}>
                        Sign In
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup">
                      <Button color="secondary" variant="contained" size={buttonSize}>
                        Sign Up
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
