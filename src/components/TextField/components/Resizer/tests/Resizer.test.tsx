import * as React from 'react';
import {mountWithAppProvider, findByTestID, trigger} from 'test-utilities';
import {noop} from '@shopify/javascript-utilities/other';
import Resizer from '../Resizer';
import EventListener from '../../../../EventListener';

describe('<Resizer />', () => {
  const mockProps = {
    onHeightChange: noop,
    contents: 'Contents',
  };

  describe('contents', () => {
    it('renders contents', () => {
      const contents = 'Contents';
      const resizer = mountWithAppProvider(
        <Resizer {...mockProps} contents={contents} />,
      );
      const contentsNode = findByTestID(resizer, 'ContentsNode');
      const expectedHTML = '<div testid="ContentsNode">Contents<br></div>';
      expect(contentsNode.html()).toBe(expectedHTML);
    });

    it('properly encodes HTML entities', () => {
      const contents = `<div>&\nContents</div>`;
      const resizer = mountWithAppProvider(
        <Resizer {...mockProps} contents={contents} />,
      );
      const contentsNode = findByTestID(resizer, 'ContentsNode');
      const expectedEncodedContents =
        '&lt;div&gt;&amp;<br>Contents&lt;/div&gt;<br></div>';
      expect(contentsNode.html()).toContain(expectedEncodedContents);
    });
  });

  describe('minimumLines', () => {
    it('renders a number of <br> tags equivalent to minimumLines', () => {
      const minimumLines = 3;
      const resizer = mountWithAppProvider(
        <Resizer {...mockProps} minimumLines={minimumLines} />,
      );
      const breakingSpaces = findByTestID(resizer, 'MinimumLines');
      expect(breakingSpaces.html()).toContain('<br><br><br>');
    });
  });

  describe('onHeightChange()', () => {
    it('is called on componentDidMount() if minimumLines is provided', () => {
      const spy = jest.fn();
      const minimumLines = 3;
      mountWithAppProvider(
        <Resizer
          {...mockProps}
          currentHeight={50}
          onHeightChange={spy}
          minimumLines={minimumLines}
        />,
      );
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('is not called if minimumLines is not provided', () => {
      const spy = jest.fn();
      mountWithAppProvider(
        <Resizer {...mockProps} currentHeight={50} onHeightChange={spy} />,
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('is not called if currentHeight is the same as DOM height', () => {
      const spy = jest.fn();
      const currentHeight = 0;
      mountWithAppProvider(
        <Resizer
          {...mockProps}
          currentHeight={currentHeight}
          onHeightChange={spy}
          minimumLines={3}
        />,
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('is called again on resize', () => {
      const spy = jest.fn();
      const currentHeight = 0;
      const minimumLines = 3;
      const resizer = mountWithAppProvider(
        <Resizer
          {...mockProps}
          currentHeight={currentHeight}
          onHeightChange={spy}
          minimumLines={minimumLines}
        />,
      );
      resizer.setProps({currentHeight: 1});
      trigger(resizer.find(EventListener), 'handler');
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('aria-hidden', () => {
    it('renders aria-hidden as true', () => {
      const contents = 'Contents';
      const resizer = mountWithAppProvider(
        <Resizer {...mockProps} contents={contents} />,
      );
      const wrapperDiv = findByTestID(resizer, 'ResizerWrapper');
      expect(wrapperDiv.prop('aria-hidden')).toBe(true);
    });
  });
});
