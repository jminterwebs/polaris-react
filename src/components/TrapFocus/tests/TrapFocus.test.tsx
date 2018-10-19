import * as React from 'react';
import {mountWithAppProvider} from 'tests/utilities';
import {Focus, TextField} from 'components';
import {noop} from '@shopify/javascript-utilities/other';
import TrapFocus from '../TrapFocus';

describe('<TrapFocus />', () => {
  let requestAnimationFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame');
    requestAnimationFrameSpy.mockImplementation((cb) => cb());
  });

  afterEach(() => {
    (document.activeElement as HTMLElement).blur();
    requestAnimationFrameSpy.mockRestore();
  });

  it('mounts', () => {
    const trapFocus = mountWithAppProvider(
      <TrapFocus>
        <div />
      </TrapFocus>,
    );
    expect(trapFocus.exists()).toBe(true);
  });

  it('renders a Focus component with a `disabled` prop set to false by default', () => {
    const focus = mountWithAppProvider(
      <TrapFocus>
        <div />
      </TrapFocus>,
    ).find(Focus);
    expect(focus.prop('disabled')).toBe(false);
  });

  it('renders a Focus component with a `disabled` prop set to true when `trapping` is false', () => {
    const focus = mountWithAppProvider(
      <TrapFocus trapping={false}>
        <div />
      </TrapFocus>,
    ).find(Focus);

    expect(focus.prop('disabled')).toBe(true);
  });

  it('renders a Focus component with a `disabled` prop set to false when `trapping` is true', () => {
    const focus = mountWithAppProvider(
      <TrapFocus trapping>
        <div />
      </TrapFocus>,
    ).find(Focus);

    expect(focus.prop('disabled')).toBe(false);
  });

  it('keeps focus on nodes contained inside trap focus during mount', () => {
    const trapFocus = mountWithAppProvider(
      <TrapFocus>
        <TextField label="" value="" onChange={noop} autoFocus />
      </TrapFocus>,
    );
    const input = trapFocus.find('input').getDOMNode();
    expect(document.activeElement).toBe(input);
  });

  it('focuses the first focused node when nodes contained in trap focus are not in focus', () => {
    const focusedElement = mountWithAppProvider(
      <TrapFocus>
        <a href="/">
          <TextField label="" value="" onChange={noop} />
        </a>
      </TrapFocus>,
    )
      .find('a')
      .getDOMNode();

    expect(document.activeElement).toBe(focusedElement);
  });
});
