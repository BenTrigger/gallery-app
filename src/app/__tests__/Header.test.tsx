import { render, screen } from '@testing-library/react';
import Header from '../Header';
import i18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';

describe('Header i18n', () => {
  it('should render navigation in English and switch to Hebrew', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>
    );
    // בדיקה באנגלית
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Painting')).toBeInTheDocument();
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    // החלפת שפה לעברית
    i18n.changeLanguage('he');
    // בדיקה בעברית (ייתכן שצריך await)
    expect(await screen.findByText('ראשי')).toBeInTheDocument();
    expect(await screen.findByText('אודות')).toBeInTheDocument();
    expect(await screen.findByText('ציורים')).toBeInTheDocument();
    expect(await screen.findByText('פאנל ניהול')).toBeInTheDocument();
  });
}); 