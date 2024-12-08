import "photoswipe/dist/photoswipe.css";
import { FC } from "react";

import { Gallery, Item } from "react-photoswipe-gallery";

export const Photo: FC<{
  sources: string[];
}> = ({ sources }) => {
  return (
    <Gallery>
      <Item original={sources[0]} thumbnail={sources[0]} height={600}>
        {({ ref, open }) => (
          <img onClick={open} ref={ref} src={sources[0]} alt="" />
        )}
      </Item>
    </Gallery>
  );
};
