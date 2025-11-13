import React from 'react'
import LoaderSmiley from './src/components/loader-smiley'
import styled from 'styled-components'

const FullScreenLoader = styled.div`
  position: fixed;
  inset: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

export default function Loader() {
  return (
    <FullScreenLoader>
      <LoaderSmiley />
    </FullScreenLoader>
  )
}
