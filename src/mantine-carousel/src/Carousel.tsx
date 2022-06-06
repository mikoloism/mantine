/* eslint-disable react/no-unused-prop-types */
import React, { forwardRef, useEffect, useCallback } from 'react';
import { assignRef } from '@mantine/hooks';
import {
  useComponentDefaultProps,
  Box,
  DefaultProps,
  UnstyledButton,
  ChevronIcon,
  MantineNumberSize,
  StylesApiProvider,
  Selectors,
} from '@mantine/core';
import useEmblaCarousel from 'embla-carousel-react';
import { ForwardRefWithStaticComponents } from '@mantine/utils';
import { CarouselSlide, CarouselSlideStylesNames } from './CarouselSlide/CarouselSlide';
import { CarouselProvider } from './Carousel.context';
import { CarouselOrientation, EmblaApi } from './types';
import { getChevronRotation } from './get-chevron-rotation';
import useStyles, { CarouselStylesParams } from './Carousel.styles';

export type CarouselStylesNames = CarouselSlideStylesNames | Selectors<typeof useStyles>;

export interface CarouselProps
  extends DefaultProps<CarouselStylesNames, CarouselStylesParams>,
    React.ComponentPropsWithoutRef<'div'> {
  /** <Carousel.Slide /> components */
  children: React.ReactNode;

  /** Called when user clicks next button */
  onNextSlide?(): void;

  /** Called when user clicks previous button */
  onPreviousSlide?(): void;

  /** Get embla API as ref */
  emblaApiRef?: React.ForwardedRef<EmblaApi>;

  /** Next control aria-label */
  nextControlLabel?: string;

  /** Previous control aria-label */
  previousControlLabel?: string;

  /** Previous/next controls size in px */
  controlSize?: number;

  /** Key of theme.spacing or number to set space between next/previous control and carousel boundary */
  controlsOffset?: MantineNumberSize;

  /** Slide width, defaults to 100%, examples: 200px, 50% */
  slideSize?: string | number;

  /** Key of theme.spacing or number to set gap between slides in px */
  slideGap?: MantineNumberSize;

  /** Carousel orientation, horizontal by default */
  orientation?: CarouselOrientation;

  /** Slides container height, required for vertical orientation */
  height?: React.CSSProperties['height'];

  /** Determines how slides will be aligned relative to the container. Use number between 0-1 to align slides based on percentage, where 0.5 equals 50% */
  align?: 'start' | 'center' | 'end' | number;

  /** Number of slides that should be scrolled with next/previous buttons */
  slidesToScroll?: number;

  /** Determines whether gap should be treated as part of the slide size, true by default */
  includeGapInSize?: boolean;
}

const defaultProps: Partial<CarouselProps> = {
  controlSize: 26,
  controlsOffset: 'sm',
  slideSize: '100%',
  slideGap: 0,
  orientation: 'horizontal',
  align: 'center',
  slidesToScroll: 1,
  includeGapInSize: true,
};

export const _Carousel = forwardRef<HTMLDivElement, CarouselProps>((props, ref) => {
  const {
    children,
    className,
    emblaApiRef,
    onNextSlide,
    onPreviousSlide,
    nextControlLabel,
    previousControlLabel,
    controlSize,
    controlsOffset,
    classNames,
    styles,
    unstyled,
    slideSize,
    slideGap,
    orientation,
    height,
    align,
    slidesToScroll,
    includeGapInSize,
    ...others
  } = useComponentDefaultProps('Carousel', defaultProps, props);

  const { classes, cx, theme } = useStyles(
    { controlSize, controlsOffset, orientation, height },
    { name: 'Carousel', classNames, styles, unstyled }
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    axis: orientation === 'horizontal' ? 'x' : 'y',
    direction: theme.dir,
    align,
    slidesToScroll,
  });

  const handlePrevious = useCallback(() => {
    emblaApi?.scrollPrev();
    onPreviousSlide?.();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
    onNextSlide?.();
  }, [emblaApi]);

  useEffect(() => {
    assignRef(emblaApiRef, emblaApi);
  }, [emblaApi]);

  return (
    <StylesApiProvider classNames={classNames} styles={styles} unstyled={unstyled}>
      <CarouselProvider value={{ slideGap, slideSize, emblaApi, orientation, includeGapInSize }}>
        <Box className={cx(classes.root, className)} ref={ref} {...others}>
          <div className={classes.viewport} ref={emblaRef}>
            <div className={classes.container}>{children}</div>
          </div>
          <div className={classes.controls}>
            <UnstyledButton
              onClick={handlePrevious}
              className={classes.control}
              aria-label={previousControlLabel}
            >
              <ChevronIcon
                style={{
                  transform: `rotate(${getChevronRotation({
                    dir: theme.dir,
                    orientation,
                    direction: 'previous',
                  })}deg)`,
                }}
              />
            </UnstyledButton>

            <UnstyledButton
              onClick={handleNext}
              className={classes.control}
              aria-label={nextControlLabel}
            >
              <ChevronIcon
                style={{
                  transform: `rotate(${getChevronRotation({
                    dir: theme.dir,
                    orientation,
                    direction: 'next',
                  })}deg)`,
                }}
              />
            </UnstyledButton>
          </div>
        </Box>
      </CarouselProvider>
    </StylesApiProvider>
  );
}) as any;

_Carousel.Slide = CarouselSlide;
_Carousel.displayName = '@mantine/carousel/Carousel';

export const Carousel: ForwardRefWithStaticComponents<
  CarouselProps,
  { Slide: typeof CarouselSlide }
> = _Carousel;
