import React from 'react';
import styled from 'styled-components';

import theme from 'styles/theme';

import WarningIcon from '@material-ui/icons/Warning';

import StyledDiv from 'styles/styled-div';


/**
 *
 * PageErrorIndicator Usage Example:
 *
 *  <Layout>
 *    <PageErrorIndicator/>
 *  </Layout>
 *
 *
 */

const ErrorLabel = styled.span`
  color: ${theme.colors.gray[5]};
`;

const PageErrorIndicator = () => (
  <StyledDiv flex justifyContent="center" alignItems="center" margin={5}>
    <StyledDiv flex marginRight={3}>
      <WarningIcon
        style={{ color: theme.colors.yellow, fontSize: '60px' }}
        fontSize="large"
      />
    </StyledDiv>
    <ErrorLabel>{`There were no movies that corresponded to the filters. Please return to the original WeWatch URL.`}</ErrorLabel>
  </StyledDiv>
);

export default PageErrorIndicator;

