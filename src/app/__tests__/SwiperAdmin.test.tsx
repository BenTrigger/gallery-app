import { render, screen } from '@testing-library/react';
import SwiperAdmin from '../admin/swiper';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import '@testing-library/jest-dom';

describe('SwiperAdmin gallery preview', () => {
  it('should render all images from gallery-swiper.json', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SwiperAdmin />
      </I18nextProvider>
    );
    // בדוק שמופיע preview של כל תמונה ע"פ alt/title
    expect(await screen.findByAltText('Ai Laptop')).toBeInTheDocument();
    expect(await screen.findByAltText('Image 337b6ee0')).toBeInTheDocument();
    expect(await screen.findByAltText('AI Technology')).toBeInTheDocument();
  });
}); 