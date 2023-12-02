import { Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

function HomePage() {
  return (
    <main>
      <section style={{ backgroundColor: '#f0f0f0', padding: '80px 0 20px', textAlign: 'center' }}>
        <Typography variant="h3">Welcome to Easydb</Typography>
        <Typography variant="subtitle1">No Technical Knowledge Required!</Typography>
      </section>

      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          paddingBottom: '40px',
        }}
      >
        <Image
          style={{ borderRadius: '30%' }}
          src="/logo512.png"
          width={256}
          height={256}
          alt="logo"
        />
      </div>

      <section
        style={{
          padding: '20px 0',
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5">What is Easydb?</Typography>
        <Typography variant="body1">
          Easydb is a platform where you can spin up a database for your project with just a few
          clicks. It&apos;s a final year project for a BSc in Computer Science at Arden University.{' '}
          <br />
          It&apos;s ideal for students who don&apos;t have the technical knowledge to set up a
          database locally or using a could provider, or for anyone who wants to get started
          quickly.
        </Typography>
      </section>

      <section
        style={{ padding: '40px 0', display: 'flex', justifyContent: 'center', gap: '40px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5">Easy Setup</Typography>
          <Typography variant="body1">
            Set up your database with just a few clicks. It&apos;s that simple!
          </Typography>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5">Choose Your Database</Typography>
          <Typography variant="body1">
            Select from MySQL, MongoDB, or PostgreSQL for your project.
          </Typography>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5">No Coding Needed</Typography>
          <Typography variant="body1">
            Our user-friendly interface makes it accessible to everyone.
          </Typography>
        </div>
      </section>

      <section
        style={{
          backgroundColor: '#007BFF',
          color: '#fff',
          padding: '60px 0',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4">Get Started Now</Typography>
        <Typography variant="body1">
          Start building your project with the database you need.
        </Typography>
        <Link href="/signup">
          <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>
            {' '}
            Get Started
          </Button>
        </Link>
      </section>
    </main>
  );
}

export default HomePage;
