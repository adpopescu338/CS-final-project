import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Grid, Typography } from '@mui/material';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: '#333', color: '#fff', padding: '20px 0', textAlign: 'center' }}
    >
      <Typography variant="body2" style={{ marginBottom: '8px' }}>
        Connect with me:
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <Link
            href="https://github.com/adpopescu338"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', marginRight: '16px' }}
          >
            <GitHubIcon style={{ marginBottom: '-8px' }} /> GitHub
          </Link>
        </Grid>
        <Grid item>
          <Link
            href="https://www.linkedin.com/in/alexandru-daniel-popescu-6abbaa198"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff' }}
          >
            LinkedIn <LinkedInIcon style={{ marginBottom: '-8px' }} />
          </Link>
        </Grid>
      </Grid>
    </footer>
  );
};
