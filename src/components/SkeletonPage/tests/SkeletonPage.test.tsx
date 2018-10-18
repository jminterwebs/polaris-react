import * as React from 'react';
import {mountWithAppProvider, findByTestID} from 'test-utilities';
import {
  Layout,
  Card,
  SkeletonBodyText,
  DisplayText,
  SkeletonDisplayText,
} from 'components';
import SkeletonPage from '../SkeletonPage';

describe('<SkeletonPage />', () => {
  it('renders its children', () => {
    const children = (
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <Card sectioned title="Variants">
            <SkeletonBodyText />
          </Card>
        </Layout.Section>
      </Layout>
    );

    const skeletonPage = mountWithAppProvider(
      <SkeletonPage title="Products">{children}</SkeletonPage>,
    );
    expect(skeletonPage.contains(children)).toBe(true);
  });

  describe('title', () => {
    it('renders title when a title is provided', () => {
      const skeletonPage = mountWithAppProvider(
        <SkeletonPage title="Products" />,
      );
      const displayText = findByTestID(skeletonPage, 'TitleWrapper').find(
        DisplayText,
      );
      expect(displayText.length).toBe(1);
      expect(displayText.contains('Products')).toBe(true);
    });

    it('passes large to thesize prop and passes h1 to the element prop of DisplayText', () => {
      const skeletonPage = mountWithAppProvider(
        <SkeletonPage title="Products" />,
      );
      const displayText = findByTestID(skeletonPage, 'TitleWrapper').find(
        DisplayText,
      );
      expect(displayText.prop('size')).toBe('large');
      expect(displayText.prop('element')).toBe('h1');
    });

    it('renders a SkeletonDisplayText when the title is an empty string', () => {
      const skeletonPage = mountWithAppProvider(<SkeletonPage title="" />);
      expect(
        findByTestID(skeletonPage, 'TitleWrapper').find(SkeletonDisplayText)
          .length,
      ).toBe(1);
    });

    it('passes large to the size prop of SkeletonDisplayText', () => {
      const skeletonPage = mountWithAppProvider(<SkeletonPage title="" />);
      const skeletonDisplayText = findByTestID(
        skeletonPage,
        'TitleWrapper',
      ).find(SkeletonDisplayText);
      expect(skeletonDisplayText.prop('size')).toBe('large');
    });
  });

  it('renders the correct number of secondary actions as SkeletonBodyText', () => {
    const skeletonPage = mountWithAppProvider(
      <SkeletonPage secondaryActions={3} />,
    );
    expect(skeletonPage.find(SkeletonBodyText).length).toBe(3);
  });

  it('renders breadcrumbs', () => {
    const skeletonPage = mountWithAppProvider(<SkeletonPage breadcrumbs />);
    expect(skeletonPage.find(SkeletonBodyText).length).toBe(1);
  });

  describe('primaryAction', () => {
    it('renders SkeletonDisplayText if primaryAction is true', () => {
      const skeletonPage = mountWithAppProvider(<SkeletonPage primaryAction />);
      expect(
        findByTestID(skeletonPage, 'PrimaryAction').find(SkeletonDisplayText)
          .length,
      ).toBe(1);
    });

    it('does not render SkeletonDisplayText if primaryAction is false', () => {
      const skeletonPage = mountWithAppProvider(<SkeletonPage />);
      expect(findByTestID(skeletonPage, 'PrimaryAction').length).toBe(0);
    });
  });
});
