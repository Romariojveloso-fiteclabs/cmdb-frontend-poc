import React from 'react';
import { Lang } from '../data/families';
import { HomeHero } from './home/HomeHero';
import { HomeStats } from './home/HomeStats';
import { HomeRecentFamilies } from './home/HomeRecentFamilies';
import { HomeWorkflow } from './home/HomeWorkflow';
import { HomeActions } from './home/HomeActions';

interface HomeViewProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
  onOpenFamily: (key: string) => void;
  onSearch: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ lang, onNavigate, onOpenFamily, onSearch }) => (
  <div>
    <HomeHero lang={lang} onNavigate={onNavigate} onSearch={onSearch} />
    <HomeStats lang={lang} />
    <HomeRecentFamilies lang={lang} onNavigate={onNavigate} onOpenFamily={onOpenFamily} />
    <HomeWorkflow lang={lang} />
    <HomeActions lang={lang} onNavigate={onNavigate} />
  </div>
);
