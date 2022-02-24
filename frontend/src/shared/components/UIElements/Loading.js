import React from 'react'
import { css } from "@emotion/react";
import PuffLoader from "react-spinners/PuffLoader";

import './Loading.css'

const Loading = (props) => {

  const override = css`
  border-color: red;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 1;
  `;

  return (
    <div className='backdrop'>
      <PuffLoader color='red' loading={200000} css={override} size={100} />
    </div>
  )
}

export default Loading