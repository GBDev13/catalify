import clsx from "clsx";
import { CSSProperties, MouseEvent, useCallback, useMemo } from "react";
import { checkColorReadability } from "src/helpers/check-color-readability";

type LinksPageProps = {
  title: string
  logo?: string;
  headline?: string
  textColor: string
  textColor2: string
  boxColor: string
  boxMode: 'solid' | 'outline'
  background: string;
  background2: string;
  backgroundMode?: 'solid' | 'gradient'
  logoMode?: 'rounded' | 'free'
  links: {
    title: string
    url: string
  }[]
  previewMode?: boolean
}

export const LinksPage = ({
  title,
  headline,
  logo,
  textColor,
  textColor2,
  boxColor,
  boxMode,
  background,
  background2,
  backgroundMode = 'solid',
  logoMode = 'rounded',
  links,
  previewMode
}: LinksPageProps) => {
  const style: CSSProperties = useMemo(() => {
    return {
      ...(backgroundMode === 'solid' && { background }),
      ...(backgroundMode === 'gradient' && { background: `linear-gradient(0deg, ${background} 0%, ${background2} 100%)` }),
    }
  }, [background, background2, backgroundMode])

  const handleOnClick = useCallback((e: MouseEvent) => {
    if(previewMode) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [previewMode])

  const waterMarkTextColor = useMemo(() => {
    return checkColorReadability(background, '#fff', '#000')
  }, [background])

  return (
    <div
      key={`${background}-${background2}`}
      className="w-full h-full flex-1 flex items-center flex-col pt-10 px-2 sm:px-8"
      style={style}
      onClick={handleOnClick}
    >
      {logo && (
        <img className={clsx("object-contain", {
          'w-[100px] h-[100px] rounded-full': logoMode === 'rounded',
          'max-h-[100px]': logoMode === 'free',
        })} src={logo} />
      )}
      <h1
      className="mt-4 text-3xl font-semibold"
      style={{
        color: textColor,
      }}
      >
        {title}
      </h1>
      {headline && (
        <h2
          className="text-sm opacity-60"
          style={{ color: textColor }}
        >{headline}</h2>
      )}

      <div className="flex flex-col gap-3 mt-10 w-full">
        {links?.map((link, index) => (
          <a
            href={link.url}
            key={index}
            className={clsx("w-full py-3 hover:scale-95 hover:brightness-105 transition-all rounded-md text-center", {
              "max-w-[800px] mx-auto": !previewMode,
            })}
            style={boxMode === 'outline' ? {
              border: `1px solid ${boxColor}`,
              color: boxColor
            } : {
              background: boxColor,
              color: textColor2,
            }}
          >{link.title}</a>
        ))}
      </div>

      <a href="https://catalify.com.br" target="_blank" className="block mt-auto mb-4 pt-4 text-sm underline opacity-50 hover:opacity-100 transition-all" style={{ color: waterMarkTextColor }} rel="noreferrer">Desenvolvido por Catalify</a>
    </div>
  )
}