import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { Lang } from '../data/families';

interface EvidenceImage {
  src: string;
  alt: string;
  caption: string;
}

interface EvidenceLightboxProps {
  lang: Lang;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

function evidenceFromElement(image: HTMLImageElement): EvidenceImage {
  const figureCaption = image.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
  return {
    src: image.currentSrc || image.src,
    alt: image.alt || (image.ownerDocument.documentElement.lang.startsWith('pt') ? 'Evidência ampliada' : 'Expanded evidence'),
    caption: figureCaption || image.title || image.alt || '',
  };
}

export const EvidenceLightbox: React.FC<EvidenceLightboxProps> = ({ lang }) => {
  const [evidence, setEvidence] = useState<EvidenceImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const isPt = lang === 'pt';

  const close = () => {
    setEvidence(null);
    setZoom(1);
  };

  const changeZoom = (amount: number) => {
    setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + amount)));
  };

  useEffect(() => {
    const imageSelector = '[data-evidence-lightbox], .markdown-evidence-image';

    const openImage = (image: HTMLImageElement) => {
      returnFocusRef.current = image;
      setEvidence(evidenceFromElement(image));
      setZoom(1);
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const image = target.closest<HTMLImageElement>(imageSelector);
      if (!image) return;
      event.preventDefault();
      openImage(image);
    };

    const handleImageKeyboard = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const target = event.target;
      if (!(target instanceof HTMLImageElement) || !target.matches(imageSelector)) return;
      event.preventDefault();
      openImage(target);
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleImageKeyboard);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleImageKeyboard);
    };
  }, []);

  useEffect(() => {
    if (!evidence) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleDialogKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        changeZoom(ZOOM_STEP);
      }
      if (event.key === '-') {
        event.preventDefault();
        changeZoom(-ZOOM_STEP);
      }
      if (event.key === '0') {
        event.preventDefault();
        setZoom(1);
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const controls = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)'),
        );
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleDialogKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleDialogKeyboard);
      returnFocusRef.current?.focus();
    };
  }, [evidence]);

  if (!evidence || typeof document === 'undefined') return null;

  const zoomPercent = Math.round(zoom * 100);

  return createPortal(
    <div
      ref={dialogRef}
      className="evidence-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-lightbox-title"
      aria-describedby="evidence-lightbox-hint"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="evidence-lightbox__toolbar">
        <strong id="evidence-lightbox-title">
          {evidence.caption || (isPt ? 'Evidência ampliada' : 'Expanded evidence')}
        </strong>
        <div className="evidence-lightbox__controls">
          <button
            type="button"
            onClick={() => changeZoom(-ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label={isPt ? 'Reduzir imagem' : 'Zoom out'}
            title={isPt ? 'Reduzir' : 'Zoom out'}
          >
            <Minus size={19} />
          </button>
          <button
            type="button"
            className="evidence-lightbox__zoom-value"
            onClick={() => setZoom(1)}
            aria-label={isPt ? 'Restaurar tamanho original' : 'Reset zoom'}
            title={isPt ? 'Restaurar zoom' : 'Reset zoom'}
          >
            <RotateCcw size={15} />
            <span aria-live="polite">{zoomPercent}%</span>
          </button>
          <button
            type="button"
            onClick={() => changeZoom(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label={isPt ? 'Ampliar imagem' : 'Zoom in'}
            title={isPt ? 'Ampliar' : 'Zoom in'}
          >
            <Plus size={19} />
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            className="evidence-lightbox__close"
            onClick={close}
            aria-label={isPt ? 'Fechar visualizador' : 'Close viewer'}
            title={isPt ? 'Fechar' : 'Close'}
          >
            <X size={21} />
          </button>
        </div>
      </div>

      <div
        className="evidence-lightbox__stage"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onDoubleClick={() => setZoom((current) => current === 1 ? 2 : 1)}
      >
        <img
          src={evidence.src}
          alt={evidence.alt}
          style={{
            width: zoom === 1 ? 'auto' : `${zoom * 100}%`,
            maxWidth: zoom === 1 ? '100%' : 'none',
            maxHeight: zoom === 1 ? 'calc(100vh - 190px)' : 'none',
          }}
        />
      </div>

      <p id="evidence-lightbox-hint" className="evidence-lightbox__hint">
        {isPt
          ? 'Use os controles, as teclas + e − ou dê dois cliques na imagem.'
          : 'Use the controls, the + and − keys, or double-click the image.'}
      </p>
    </div>,
    document.body,
  );
};
