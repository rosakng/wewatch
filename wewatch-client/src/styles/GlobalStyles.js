import { createGlobalStyle } from 'styled-components';

import theme from 'styles/theme';

import NotoSansRegularWoff from 'assets/fonts/NotoSans-Regular.woff';
import NotoSansRegularWoff2 from 'assets/fonts/NotoSans-Regular.woff2';
import NotoSansBoldWoff from 'assets/fonts/NotoSans-Bold.woff';
import NotoSansBoldWoff2 from 'assets/fonts/NotoSans-Bold.woff2';
import NotoSansBoldItalicWoff from 'assets/fonts/NotoSans-BoldItalic.woff';
import NotoSansBoldItalicWoff2 from 'assets/fonts/NotoSans-BoldItalic.woff2';
import NotoSansItalicWoff from 'assets/fonts/NotoSans-Italic.woff';
import NotoSansItalicWoff2 from 'assets/fonts/NotoSans-Italic.woff2';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Noto';
    font-weight: 400;
    font-style: normal;
    src: url('${NotoSansRegularWoff}') format('woff'),
        url('${NotoSansRegularWoff2}') format('woff2');
  }
  @font-face {
    font-family: 'Noto';
    font-weight: 400;
    font-style: italic;
    src: url('${NotoSansItalicWoff}') format('woff'),
         url('${NotoSansItalicWoff2}') format('woff2');
  }
  @font-face {
    font-family: 'Noto';
    font-weight: 600;
    font-style: italic;
    src: url('${NotoSansBoldItalicWoff}') format('woff'),
         url('${NotoSansBoldItalicWoff2}') format('woff2');
  }
  @font-face {
    font-family: 'Noto';
    font-weight: 600;
    font-style: normal;
    src: url('${NotoSansBoldWoff}') format('woff'),
         url('${NotoSansBoldWoff2}') format('woff2');
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  body {
    color: ${theme.colors.gray[9]};
    font-family: ${theme.font.family.sans};
    font-size: ${theme.font.size[3]};
    font-weight: ${theme.font.weight.normal};
    letter-spacing: 0.1px;
    margin: 0;
  }
  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyles;
