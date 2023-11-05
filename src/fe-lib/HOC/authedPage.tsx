import { CircularProgress } from '@mui/material';
import { useSession } from 'src/contexts';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import styled from '@emotion/styled';

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

export const authedPage = (component) => (props) => {
  const session = useSession();
  const navigate = useNavigate();
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
    }).then((ok) => {
      navigate('/signin');
    });

    return <Loading />;
  }

  return component(props);
};
