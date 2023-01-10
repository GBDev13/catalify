import { useKeenSlider } from "keen-slider/react"
import { ThumbnailPlugin } from "./thumb-plugin"
import "keen-slider/keen-slider.min.css"

type ProductsSliderProps = {
  pictures?: string[]
}

export const ProductSlider = ({ pictures = [] }: ProductsSliderProps) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  })
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  )

  return (
    <section className="w-full overflow-hidden">
      <div ref={sliderRef} className="keen-slider border border-gray-200 rounded-lg">
        {pictures.map((thumbnail, index) => (
          <div key={index} className="keen-slider__slide aspect-square rounded-lg overflow-hidden">
            <img src={thumbnail} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div ref={thumbnailRef} className="keen-slider">
        {pictures.map((thumbnail, index) => (
          <div key={index} className="cursor-pointer keen-slider__slide mt-[10px] [&.active]:!border-primary border-2 border-gray-100 rounded overflow-hidden transition-colors aspect-square">
            <img src={thumbnail} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}