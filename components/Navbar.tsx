import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMutation } from 'react-query';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';

export const Navbar = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const moreThan352 = useMediaQuery('(min-width:352px)');

  const buttonSize = 'small';

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = useMutation(() => {
    signOut({
      redirect: false,
      callbackUrl: '/',
    });

    return push('/');
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Image
                src="/logo512.png"
                alt="Logo"
                height={40}
                width={40}
                style={{ marginRight: '20px' }}
              />
            </Grid>

            <Grid item xs>
              <Grid container spacing={2}>
                {moreThan352 && (
                  <Grid item>
                    <Link href="/">
                      <Button color="secondary" variant="contained" size={buttonSize}>
                        Home
                      </Button>
                    </Link>
                  </Grid>
                )}
                {session?.user && (
                  <Grid item>
                    <Link href="/dashboard">
                      <Button color="secondary" variant="contained" size={buttonSize}>
                        Dashboard
                      </Button>
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item>
              {session?.user ? (
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
                        push('/settings');
                      }}
                    >
                      Settings
                    </MenuItem>
                    <MenuItem onClick={() => logout.mutate()}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <Grid container spacing={2}>
                  <Grid item>
                    <Link href="/signin">
                      <Button color="secondary" variant="contained" size={buttonSize}>
                        Sign In
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup">
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
