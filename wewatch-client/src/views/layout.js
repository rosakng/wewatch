import React from 'react';

import StyledDiv from 'styles/styled-div';
import Menu from 'views/menu';

const Layout = ({ children }) => (
  <StyledDiv>
    <Menu />
    {children}
  </StyledDiv>
);

export default Layout;
