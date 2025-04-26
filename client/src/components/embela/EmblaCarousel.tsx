import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselDotArrow";
import useEmblaCarousel from "embla-carousel-react";
import { NewsCard1, NewsCard2, NewsCard3, NewsCard4 } from "./newsCard";
import "./embla.css";
import SectionTitle from "../common/section-title";
import Section from "../common/section";

// type CardEntry = {
//   type: string;
//   cardTitle: string;
//   cardDate: string;
//   cardBody: string;
//   readMoreBtn: string;
// };

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // const { selectedIndex, scrollSnaps, onDotButtonClick } =
  //   useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <Section>
      <div>
        <SectionTitle>وبلاگ</SectionTitle>
        <section className="news-swiper">
          {/* dir="rtl" for fa routes */}
          <div className="embla" dir="rtl">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                {slides.map((index) => (
                  <>
                    <div className="embla__slide" key={index}>
                      <NewsCard1 />
                    </div>
                    <div className="embla__slide" key={index}>
                      <NewsCard2 />
                    </div>
                    <div className="embla__slide" key={index}>
                      <NewsCard3 />
                    </div>
                    <div className="embla__slide" key={index}>
                      <NewsCard4 />
                    </div>
                  </>
                ))}
              </div>
            </div>
            <div className="embla__controls">
              <div className="embla__buttons">
                <PrevButton
                  className="prev-btn"
                  onClick={onPrevButtonClick}
                  disabled={prevBtnDisabled}
                />
                <NextButton
                  className="next-btn"
                  onClick={onNextButtonClick}
                  disabled={nextBtnDisabled}
                />
              </div>
              {/* <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : ""
                )}
              />
            ))}
          </div> */}
            </div>
          </div>
        </section>
      </div>
    </Section>
  );
};

export default EmblaCarousel;
