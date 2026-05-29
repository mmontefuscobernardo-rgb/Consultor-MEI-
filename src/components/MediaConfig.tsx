import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check, RefreshCw, Sliders } from 'lucide-react';

interface MediaConfigProps {
  photoUrl: string | null;
  bannerUrl: string | null;
  useGraphicMode?: boolean;
  onUpdateMedia: (photo: string | null, banner: string | null, useGraphicMode?: boolean) => void;
}

export default function MediaConfig({ photoUrl, bannerUrl, useGraphicMode = false, onUpdateMedia }: MediaConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputPhoto = useRef<HTMLInputElement>(null);
  const fileInputBanner = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateMedia(reader.result as string, bannerUrl, useGraphicMode);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateMedia(photoUrl, reader.result as string, useGraphicMode);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    onUpdateMedia(null, bannerUrl, useGraphicMode);
  };

  const clearBanner = () => {
    onUpdateMedia(photoUrl, null, false);
  };

  const resetAll = () => {
    onUpdateMedia(null, null, false);
  };

  return (
    <div id="media-config-panel" className="fixed bottom-4 right-4 z-50">
      <button
        id="toggle-media-config-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 font-sans text-xs rounded-full shadow-lg hover:bg-emerald-900 transition-all duration-300 backdrop-blur-sm"
      >
        <Sliders className="w-3.5 h-3.5" />
        Configurar Imagens
      </button>

      {isOpen && (
        <div
          id="media-config-drawer"
          className="absolute bottom-12 right-0 w-80 p-5 bg-emerald-950/95 border border-emerald-500/40 rounded-2xl shadow-2xl backdrop-blur-md font-sans text-stone-200 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex justify-between items-center mb-4 border-b border-emerald-500/20 pb-2">
            <h4 id="media-editor-title" className="text-sm font-semibold text-emerald-300">Editor de Aparência</h4>
            <button
              id="reset-media-btn"
              onClick={resetAll}
              title="Restaurar Padrão"
              className="text-stone-400 hover:text-emerald-400 p-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-stone-400 mb-4 leading-relaxed">
            Personalize a landing page enviando sua própria foto de perfil ou o arquivo da imagem do banner original.
          </p>

          <div className="space-y-4">
            {/* Photo Section */}
            <div id="photo-config-section" className="space-y-2">
              <label className="text-xs font-medium text-emerald-400 block">Sua Foto de Perfil (foto.jpg)</label>
              <div className="flex gap-2 items-center">
                <button
                  id="upload-photo-btn"
                  onClick={() => fileInputPhoto.current?.click()}
                  className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-500/20 rounded-xl text-xs font-medium transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {photoUrl ? 'Substituir Foto' : 'Enviar Foto'}
                </button>
                {photoUrl && (
                  <button
                    id="clear-photo-btn"
                    onClick={clearPhoto}
                    className="px-3 py-2 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-500/20 rounded-xl text-xs transition-colors"
                  >
                    Excluir
                  </button>
                )}
              </div>
              <input
                ref={fileInputPhoto}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {photoUrl ? (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                  <Check className="w-3 h-3" /> Foto personalizada ativa
                </div>
              ) : (
                <div className="text-[10px] text-stone-500 mt-1">
                  Usando avatar vetorizado de alta fidelidade do especialista.
                </div>
              )}
            </div>

            {/* Banner Section */}
            <div id="banner-config-section" className="space-y-2 pt-2 border-t border-emerald-500/10">
              <label className="text-xs font-medium text-emerald-400 block">Fundo do Banner (banner.jpg)</label>
              <div className="flex gap-2 items-center">
                <button
                  id="upload-banner-btn"
                  onClick={() => fileInputBanner.current?.click()}
                  className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-500/20 rounded-xl text-xs font-medium transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {bannerUrl ? 'Substituir Banner' : 'Enviar Banner'}
                </button>
                {bannerUrl && (
                  <button
                    id="clear-banner-btn"
                    onClick={clearBanner}
                    className="px-3 py-2 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-500/20 rounded-xl text-xs transition-colors"
                  >
                    Excluir
                  </button>
                )}
              </div>
              <input
                ref={fileInputBanner}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
              {bannerUrl ? (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                  <Check className="w-3 h-3" /> Imagem de fundo ativa
                </div>
              ) : (
                <div className="text-[10px] text-stone-500 mt-1">
                  Usando gradientes e órbitas geradas e renderizadas nativamente na web.
                </div>
              )}
            </div>

            {/* Graphic Mode Toggle Section */}
            {bannerUrl && (
              <div id="graphic-mode-toggle-section" className="space-y-2 pt-2 border-t border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-400">Modo Banner Gráfico</span>
                  <label id="graphic-toggle-switch" className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useGraphicMode}
                      onChange={(e) => onUpdateMedia(photoUrl, bannerUrl, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-emerald-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-emerald-300 after:border-emerald-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>
                <p className="text-[10px] text-stone-400 leading-normal">
                  Ative se o seu banner de fundo já possuir os textos e títulos incorporados. Isso oculta os textos digitais para focar no design gráfico da imagem original com a sua foto integrada.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-end">
            <button
              id="close-media-config"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-semibold rounded-lg transition-colors"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
