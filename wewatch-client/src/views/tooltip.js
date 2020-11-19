import React from 'react';
import styled from 'styled-components';

import theme from 'styles/theme';


/**
 *
 * Tooltip Usage Example:
 *
 *  <Tooltip
 *    text="Hover for more information on things that may not be as clear."
 *  >
 *    <InfoIcon />  // children can be any DOM node
 *  </Tooltip>
 *
 */

const TooltipContainer = styled.span`
  position: relative;
  cursor: pointer;
  align-self: center;
  display: flex;
`;

const TooltipText = styled.span`
  visibility: hidden;
  opacity: ${theme.overlayOpacity};
  padding: ${theme.space[3]} ${theme.space[4]};
  color: ${theme.colors.gray[8]};
  background-color: ${theme.colors.lightGray[2]};

  border: 1px ${theme.colors.gray[3]} solid;
  border-radius: 6px;
  position: absolute;
  text-align: center;
  width: ${theme.space[8]};
  bottom: -${theme.space[13]};
  left: -${theme.space[6]};

  ${TooltipContainer}:hover & {
    visibility: visible;
  }
`;

const Tooltip = ({ text, children }) => (
  <TooltipContainer>
    {children}
    <TooltipText>{text}</TooltipText>
  </TooltipContainer>
);

export default Tooltip;
