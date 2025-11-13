'use client';
import React from 'react';
import LoaderSmiley from '../../../src/components/loader-smiley';
import styled from 'styled-components';

const Centered = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredLoader = () => {
  return (
    <Centered>
      <LoaderSmiley />
    </Centered>
  );
};

export default CenteredLoader;
