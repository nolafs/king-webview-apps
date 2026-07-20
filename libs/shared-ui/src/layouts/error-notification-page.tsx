import type React from 'react';
import KingLogo from '../assets/kingLogoRebrand.svg';

interface ErrorNotificationPageProps {
  title: string;
  message: string;
}

export const ErrorNotificationPage = ({ title, message }: ErrorNotificationPageProps) => {
  return (
    <div className={'flex h-screen w-full flex-col items-center justify-center bg-[#f7f4ef]'}>
      <KingLogo width={200} className={'mb-16'} aria-label="King logo" />
      <h1 className={'text-center text-4xl font-bold text-red-500'}>{title}</h1>
      <p className={'text-xl text-red-500'}>{message}</p>
    </div>
  );
};

export default ErrorNotificationPage;
