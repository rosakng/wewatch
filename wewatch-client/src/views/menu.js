import React from 'react';
import styled from 'styled-components';
import WeekendIcon from '@material-ui/icons/Weekend';

import StyledDiv from 'styles/styled-div';
import theme from 'styles/theme';

const MenuContainer = styled.header`
  height: auto;
  padding: ${theme.space[2]};
  background: ${theme.colors.gray[2]};
`;

const AppName = styled.text`
  color: ${theme.colors.gray[5]};
  font-size: ${theme.font.size[8]};
  font-weight: ${theme.font.weight.semibold};
  margin-left: ${theme.space[4]};
`;

const Menu = () => (
  <MenuContainer>
    <StyledDiv marginLeft={4} flex justifyContent="flex-start">
      <WeekendIcon 
        style={{ color: theme.colors.gray[5], fontSize: '80px'}}
      />
      <AppName>
        {'WeWatch '}
      </AppName>
    </StyledDiv>
  </MenuContainer>
);

export default Menu;
