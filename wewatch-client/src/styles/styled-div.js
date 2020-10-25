import styled from 'styled-components';

import theme from 'styles/theme';


/**
 *
 * WARNING: Before changing this file, please strongly consider whether your change is
 * necessary (we want to avoid unexpected bugs in other views).
 * This code is meant to be shared by many views throughout our app and should not
 * contain logic specifc to how your view is using it.
 *
 */

const flexbox = (props) => ({
  display: props.flex ? 'flex' : undefined,
  flexDirection: props.flexDirection,
  justifyContent: props.justifyContent,
  alignItems: props.alignItems,
});

const getSpacing = (index) => theme.space[index];

const spacing = (props) => ({
  paddingBottom: getSpacing(props.paddingBottom || props.paddingVertical || props.padding),
  paddingLeft: getSpacing(props.paddingLeft || props.paddingHorizontal || props.padding),
  paddingRight: getSpacing(props.paddingRight || props.paddingHorizontal || props.padding),
  paddingTop: getSpacing(props.paddingTop || props.paddingVertical || props.padding),

  marginBottom: getSpacing(props.marginBottom || props.marginVertical || props.margin),
  marginLeft: getSpacing(props.marginLeft || props.marginHorizontal || props.margin),
  marginRight: getSpacing(props.marginRight || props.marginHorizontal || props.margin),
  marginTop: getSpacing(props.marginTop || props.marginVertical || props.margin),
});

const size = (props) => ({
  maxWidth: props.maxWidth,
  width: props.width || props.size,
  height: props.height || props.size,
});

const StyledDiv = styled.div`
  ${flexbox}
  ${spacing}
  ${size}
`;

export default StyledDiv;

