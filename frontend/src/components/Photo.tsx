import "photoswipe/dist/photoswipe.css";
import { FC } from "react";

import { Gallery, Item } from "react-photoswipe-gallery";

export const Photo: FC<{
  sources: string[];
}> = ({ sources }) => {
  return (
    <Gallery>
      <Item
        original={sources[0]}
        thumbnail={sources[0]}
        width={100}
        height={100}
      >
        {({ ref, open }) => (
          <img onClick={open} ref={ref} src={sources[0]} alt="" />
        )}
      </Item>
    </Gallery>
  );
};
