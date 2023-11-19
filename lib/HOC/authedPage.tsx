import { CircularProgress } from '@mui/material';
import React from 'react';
import swal from 'sweetalert';
import styled from '@emotion/styled';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 100px;
  display: flex;
  justify-content: center;
`;

const Loading = () => {
  return (
    <Wrapper>
      <CircularProgress size={70} />
    </Wrapper>
  );
};

// eslint-disable-next-line react/display-name
export const authedPage = (component) => (props) => {
  const session = useSession();
  const { push: navigate } = useRouter();

  if (session.status === 'loading') {
    return <Loading />;
  }

  if (session.status === 'unauthenticated') {
    swal({
      title: 'You are not logged in',
      text: 'You need to be logged in to access this page',
      buttons: {
        ok: true,
      },
    }).then(() => {
      navigate('/signin');
    });

    return <Loading />;
  }

  return component(props);
};
